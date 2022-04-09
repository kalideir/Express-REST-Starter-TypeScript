import { Role, UserDocument, UserModel } from '../models';
import { UpdateUserInput } from '../schema';
import { FilterQuery } from 'mongoose';

export type CreateUserPartial = Partial<{
  email: string;
  password: string;
  role: string;
}>;

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
