import { Request, Response } from 'express';
import httpStatus from 'http-status';
import _ from 'lodash';
import { CreateUserPartial, ListUsersQueryType } from '../@types';
import { Role, UserDocument, UserModel } from '../models';
import {
  CreateUserInput,
  DeleteUserInput,
  GetUsersInput,
  ListUsersInput,
  ToggleUserDisableInput,
  UpdateOtherUserInput,
  UpdateUserInput,
} from '../schema';
import { createUser, findUserById, generateVerificationCode, toggleDisableById, updateUser } from '../services';
import passwordGenerator from 'generate-password';

import { logger, sendEmail } from '../utils';
import { sendEmailProducer } from '../workers';

import config from 'config';

const clientUrl = config.get<string>('clientUrl');

export async function get(req: Request<GetUsersInput['params']>, res: Response) {
  try {
    const { id } = req.params;
    let user = await findUserById(id);
    user = await (await (await user.populate('company')).populate('employee')).populate('resume');
    const result = user.toJSON();
    return res.json({ ...result });
  } catch (e) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: 'Something went wrong.' });
  }
}

export async function create(req: Request<unknown, unknown, CreateUserInput['body']>, res: Response) {
  try {
    const owner = res.locals.user;
    const password = passwordGenerator.generate({
      length: 10,
      numbers: true,
    });
    let payload: CreateUserPartial = { ...req.body, password };
    if (owner.role === Role.COMPANY_MANAGER) {
      payload = { ...payload, companyId: owner.id };
    }
    if (owner.role === Role.EMPLOYEE) {
      payload = { ...payload, companyId: owner.companyId, employeeId: owner.id };
    }
    const user = await createUser(payload);
    const verificationCode = await generateVerificationCode(user.email);
    user.verificationCode = verificationCode;
    await user.save();
    const emailOptions = {
      to: user.email,
      subject: 'Ditt konto har skapats framgångsrikt. Vänligen verifiera din e-postadress.',
    };
    const context = {
      description: `För att kunna logga in vänligen verifiera din e-post via denna länk. Använd \n e-post:<b> ${user.email} </b> och \n Lösenord: <b> ${password} </b> för att logga in på ditt konto efter verifiering.`,
      subject: 'Ditt konto har skapats framgångsrikt. Vänligen verifiera din e-postadress.',
      action: 'Aktivera konto',
      actionUrl: `${clientUrl}/verify-account/${verificationCode}`,
      message: 'Välkommen till AhlanJobb',
      btnText: 'Aktivera konto',
    };
    if (req.body.role !== 'USER') {
      sendEmail(emailOptions, context);
    }
    res.json({ message: 'Kontot har skapats.' });
  } catch (e) {
    logger.error(e);
    return res.status(httpStatus.CONFLICT).send({ message: 'Kontot finns redan.' });
  }
}

export async function update(req: Request<UpdateUserInput['body']>, res: Response) {
  try {
    const user = res.locals.user;
    let body = req.body;
    // logger.info(user);
    logger.info({ cats: user.categories });
    // logger.info(body);
    body = _.omit(body, ['password', 'passwordConfirmtion', 'email', 'role']);
    let newUser = await updateUser(user.id, body);

    newUser = await (await (await (await newUser.populate('company')).populate('employee')).populate('profilePicture')).populate('resume');
    return res.send({ user: newUser.toJSON(), message: 'Användarinformationen har uppdaterats' });
  } catch (e) {
    console.log(e);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: 'Något gick fel' });
  }
}

export async function updateUserHandler(req: Request<UpdateOtherUserInput['params'], UpdateOtherUserInput['body']>, res: Response) {
  try {
    const user = await findUserById(req.params.id);
    let body = req.body;
    logger.info({ cats: user.categories });
    body = _.omit(body, ['password', 'passwordConfirmtion', 'email', 'role']);
    let newUser = await updateUser(user.id, body);
    logger.info({ cats: newUser.categories });
    newUser = await (await (await (await newUser.populate('company')).populate('employee')).populate('profilePicture')).populate('resume');
    return res.send({ user: await newUser.toJSON(), message: 'Användarinformationen har uppdaterats' });
  } catch (e) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: 'Något gick fel' });
  }
}

export async function deleteUser(req: Request<DeleteUserInput['params']>, res: Response) {
  try {
    const user = await findUserById(req.params.id);
    await user.remove();
    return res.send({ message: 'Användare har raderats.' });
  } catch (e) {
    logger.error(e);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: 'Något gick fel' });
  }
}

export async function listUsers(req: Request<ListUsersInput['query']>, res: Response) {
  try {
    logger.debug(req.query);
    const search = req.query.search as string | null;
    const city = req.query.city as string | null;
    const category = req.query.category as string | null;
    const startDate = req.query.startDate as string | null;
    const endDate = req.query.endDate as string | null;
    const limit = +req.query.limit || 10;
    let page = +req.query.page;
    page = page > 1 ? page : 1;
    page = page - 1;
    const skip = page * (limit - 1);
    const user = res.locals.user;
    const { role } = req.query as ListUsersInput['query'];
    if ((user.role === Role.COMPANY_MANAGER || user.role === Role.EMPLOYEE) && role === Role.ADMIN) {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
    let query: ListUsersQueryType & { $and: unknown[] } = { role, $and: [], _id: { $ne: user.id } };
    query.$and.push({
      $or: [
        { firstName: new RegExp(search, 'i') },
        { lastName: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
        { phoneNumber: new RegExp(search, 'i') },
      ],
    });

    if (category) {
      query.$and.push({ categories: { $elemMatch: { id: category } } });
    }

    if (city) {
      query.$and.push({ city: new RegExp(city, 'i') });
    }

    if (startDate) {
      query.startDate = { $gte: new Date(startDate + 'T00:00:00') };
    }

    if (endDate) {
      query.endDate = { $gte: new Date(endDate + 'T23:59:59') };
    }

    // query.$and.push({
    //   categories: { $elemMatch: { name: req.query.search } },
    // });

    if (query.$and.length === 0) {
      delete query.$and;
    }
    if (user.role === Role.COMPANY_MANAGER) {
      query = { ...query, companyId: user.id };
    }
    if (user.role === Role.EMPLOYEE) {
      query = { ...query, employeeId: user.id };
    }

    let orderBy = req.query.orderBy || 'firstName';
    if (req.query.orderDirection === 'desc') {
      orderBy = `-${orderBy}`;
    }

    const totalDocumentsCount = await UserModel.countDocuments({});
    const filteredTotal = await UserModel.countDocuments(query);
    const users: UserDocument[] = await UserModel.find({ ...query })
      .limit(role === Role.USER ? limit : totalDocumentsCount)
      .skip(skip)
      .sort(orderBy)
      .populate('company')
      .populate('employee')
      .populate('resume')
      .exec();
    const result = users.map(user => user.toJSON());
    return res.send({ users: result, page, filteredTotal, total: totalDocumentsCount });
  } catch (e) {
    logger.error(e);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: 'Något gick fel.' });
  }
}

export async function toggleDisable(req: Request<ToggleUserDisableInput['params']>, res: Response) {
  // function to disable either employees or companies
  try {
    const user = res.locals.user;
    const { id } = req.params;
    console.log(user, 'X');
    if (user.role === Role.ADMIN || user.role === Role.COMPANY_MANAGER) {
      await toggleDisableById(id);
      return res.send({ message: 'Användaren har inaktiverats' });
    } else {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: 'Något gick fel' });
    logger.error(err);
  }
}