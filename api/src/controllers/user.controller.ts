import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { Role, UserDocument, UserModel } from '../models';
import { DeleteUserInput, GetUsersInput, ListUsersInput, UpdateUserInput } from '../schema';
import { findUserById, updateUser } from '../services';

import { logger, sendEmail, t } from '../utils';
import { sendEmailProducer } from '../workers';

import config from 'config';

export type ListUsersQueryType = Partial<{
  companyId: string;
  employeeId: string;
  verified: boolean;
  role: string;
  limit: string;
  page: string;
  search: string;
  [name: string]: unknown;
}>;

export async function get(req: Request<GetUsersInput['params']>, res: Response) {
  try {
    const { id } = req.params;
    let user = await findUserById(id);
    user = await user.populate('profilePicture');
    const result = user.toJSON();
    return res.json({ ...result });
  } catch (e) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: t('something_went_wrong') });
  }
}

export async function update(req: Request<UpdateUserInput>, res: Response) {
  try {
    const user = res.locals.user;
    const body = req.body;
    delete body.password;
    delete body.passwordConfirmtion;
    delete body.email;
    let newUser = await updateUser(user.id, body);

    newUser = await newUser.populate('profilePicture');
    return res.send({ user: newUser.toJSON(), message: t('update_success') });
  } catch (e) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: t('something_went_wrong') });
  }
}

export async function remove(req: Request<DeleteUserInput['params']>, res: Response) {
  try {
    const user = await findUserById(req.params.id);
    await user.remove();
    return res.send({ message: t('delete_success') });
  } catch (e) {
    logger.error(e);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: t('something_went_wrong') });
  }
}

export async function listUsers(req: Request<ListUsersInput['query']>, res: Response) {
  try {
    logger.debug(req.query);
    const search = req.query.search as string | null;
    const limit = +req.query.limit || 10;
    let page = +req.query.page;
    page = page > 1 ? page : 1;
    page = page - 1;
    const skip = page * (limit - 1);
    const user = res.locals.user;
    const { role } = req.query as ListUsersInput['query'];
    if (user.role !== Role.ADMIN && role === Role.ADMIN) {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
    const query: ListUsersQueryType & { $and: unknown[] } = { role, $and: [], _id: { $ne: user.id } };
    query.$and.push({
      $or: [
        { firstName: new RegExp(search, 'i') },
        { lastName: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
        { phoneNumber: new RegExp(search, 'i') },
      ],
    });

    if (query.$and.length === 0) {
      delete query.$and;
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
      .populate('profilePicture')
      .exec();
    const result = users.map(user => user.toJSON());
    return res.send({ users: result, page, filteredTotal, total: totalDocumentsCount });
  } catch (e) {
    logger.error(e);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: t('something_went_wrong') });
  }
}
