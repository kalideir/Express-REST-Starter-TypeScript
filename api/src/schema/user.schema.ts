import { number, object, string, TypeOf, literal, array, date } from 'zod';
import { Role } from '../models';

const userPayload = {
  body: object({
    firstName: string({
      required_error: 'First name is required',
    }).optional(),
    lastName: string({
      required_error: 'Last name is required',
    }).optional(),
    address: string({
      required_error: 'Address is required',
    }).optional(),
    phoneNumber: string({
      required_error: 'Phone number is required',
    }).optional(),
    profilePictureId: string({}).nullable().optional(),
    resumeId: string({}).nullable().optional(),
    endDate: string({
      required_error: 'End date is required',
    }).optional(),
  }),
};

/**
 * @swagger
 * components:
 *  schemas:
 *    GetUserResponse:
 *      type: object
 *      properties:
 *        email:
 *          type: string
 *        firstName:
 *          type: string
 *        lastName:
 *          type: string
 *        createdAt:
 *          type: string
 *        updatedAt:
 *          type: string
 *        categories:
 *          type: string
 *        phoneNumber:
 *          type: string
 *        country:
 *          type: string
 *        city:
 *          type: string
 *        zip:
 *          type: string
 *        address:
 *          type: string
 *        birthdate:
 *          type: string
 *        companyName:
 *          type: string
 *        profilePicture:
 *          type: string
 *        role:
 *          type: string
 */
export const getUserSchema = object({
  params: object({
    id: string(),
  }),
});

/**
 * @swagger
 * components:
 *  schemas:
 *    UpdateUserInput:
 *      type: object
 *    UpdateUserResponse:
 *        type: object
 *        properties:
 *          email:
 *            type: string
 *          firstName:
 *            type: string
 *          lastName:
 *            type: string
 *          createdAt:
 *            type: string
 *          updatedAt:
 *            type: string
 *          phoneNumber:
 *            type: string
 *          endDate:
 *            type: string
 *          startDate:
 *            type: string
 *          fileNumber:
 *            type: number
 *          country:
 *            type: string
 *          city:
 *            type: string
 *          zip:
 *            type: string
 *          categories:
 *            type: array
 *          profilePicture:
 *            type: string
 *          id:
 *            type: string
 */
export const updateUserSchema = object({
  ...userPayload,
});

const params = {
  params: object({
    id: string({
      required_error: 'id is required',
    }),
  }),
};

const query = {
  query: object({
    role: string({}).optional(),
    page: string({}).optional(),
    companyId: string({}).optional(),
    employeeId: string({}).optional(),
    limit: string({}).optional(),
    search: string({}).optional(),
    city: string({}).optional(),
    category: string({}).optional(),
    startDate: string({}).optional(),
    endDate: string({}).optional(),
  }),
};

/**
 * @swagger
 * components:
 *  schemas:
 *    ListUsersResponse:
 *      type: object
 *      properties:
 *        email:
 *          type: string
 *        firstName:
 *          type: string
 *        lastName:
 *          type: string
 *        createdAt:
 *          type: string
 *        updatedAt:
 *          type: string
 *        categories:
 *          type: array
 *        phoneNumber:
 *          type: string
 *        country:
 *          type: string
 *        city:
 *          type: string
 *        zip:
 *          type: string
 *        address:
 *          type: string
 *        birthdate:
 *          type: string
 *        companyName:
 *          type: string
 *        profilePicture:
 *          type: string
 *        role:
 *          type: string
 */
export const listUsersSchema = object({
  ...query,
});

/**
 * @swagger
 * components:
 *  schemas:
 *    UpdateUserInput:
 *      type: object
 *    UpdateUserResponse:
 *        type: object
 *        properties:
 *          email:
 *            type: string
 *          firstName:
 *            type: string
 *          lastName:
 *            type: string
 *          createdAt:
 *            type: string
 *          updatedAt:
 *            type: string
 *          phoneNumber:
 *            type: string
 *          endDate:
 *            type: string
 *          startDate:
 *            type: string
 *          fileNumber:
 *            type: number
 *          country:
 *            type: string
 *          city:
 *            type: string
 *          zip:
 *            type: string
 *          categories:
 *            type: array
 *          profilePicture:
 *            type: string
 *          id:
 *            type: string
 */
export const updateOtherUserSchema = object({
  ...userPayload,
  params: object({ id: string({ required_error: 'user id is required' }) }),
});

export const deleteUserSchema = object({
  ...params,
});

export type UpdateUserInput = Partial<TypeOf<typeof updateUserSchema>>;
export type UpdateOtherUserInput = Partial<TypeOf<typeof updateOtherUserSchema>>;
export type ListUsersInput = TypeOf<typeof listUsersSchema>;
export type GetUsersInput = TypeOf<typeof getUserSchema>;
export type DeleteUserInput = TypeOf<typeof deleteUserSchema>;
