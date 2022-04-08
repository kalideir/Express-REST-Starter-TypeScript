import { Role, UserDocument, UserModel } from '../models';
import { UpdateUserInput } from '../schema';
import { FilterQuery } from 'mongoose';
import { CreateUserPartial } from '../@types';

export async function createUser(input: Partial<CreateUserPartial>) {
  try {
    const user = await UserModel.create(input);
    return user.save();
  } catch (e) {
    throw new Error(e);
  }
}

export async function updateUser(id: string, input: UpdateUserInput['body']) {
  try {
    const user = await UserModel.findByIdAndUpdate(id, { ...input }, { new: true });
    user.markModified('categories');
    if (input.categories) {
      user.categories = [];
      await user.save();
      if (input.categories) {
        input.categories.map((category: { id: string; name: string }) => user.categories.push(category));
      }
    }
    return await user.save();
  } catch (e) {
    throw new Error(e);
  }
}

export async function toggleDisableById(id: string) {
  try {
    const user = await findUserById(id);
    const currStatus = user.disabled;
    user.disabled = !currStatus;
    if (user.role === Role.COMPANY_MANAGER) {
      // disables employees of that company
      await UserModel.updateMany({ companyId: user.id }, { $set: { disabled: !currStatus } });
    }
    if (user.role === Role.ADMIN) {
      // disables company
      await UserModel.updateMany({ _id: user.id }, { $set: { disabled: !currStatus } });
    }
    return await user.save();
  } catch (e) {
    throw new Error(e);
  }
}

export async function findUser(query: FilterQuery<UserDocument>) {
  return UserModel.findOne(query);
}

export async function findUsers(query: FilterQuery<UserDocument>) {
  return UserModel.find(query).populate('company').populate('employee').exec();
}

export function findUserById(id: string) {
  return UserModel.findById(id);
}

export function findUserByEmail(email: string) {
  return UserModel.findOne({ email });
}
