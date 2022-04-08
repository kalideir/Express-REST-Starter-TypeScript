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
    country: string({
      required_error: 'Country is required',
    }).optional(),
    city: string({
      required_error: 'City Last name is required',
    }).optional(),
    zip: string({
      required_error: 'ZIP is required',
    }).optional(),
    address: string({
      required_error: 'Address is required',
    }).optional(),
    phoneNumber: string({
      required_error: 'Phone number is required',
    }).optional(),
    companyLicenseNumber: string({}).optional(),
    fileNumber: number({
      required_error: 'Last name is required',
    }).optional(),
    startDate: string({
      required_error: 'Start date is required',
    }).optional(),
    birthdate: string({
      required_error: 'Birthdate is required',
    }).optional(),
    profilePictureId: string({}).nullable().optional(),
    resumeId: string({}).nullable().optional(),
    endDate: string({
      required_error: 'End date is required',
    }).optional(),
    categories: array(
      object({
        id: string({
          required_error: 'category id is required',
        }),
        name: string({
          required_error: 'category name is require',
        }),
      }),
    ).optional(),
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
 *    CreateUserInput:
 *      type: object
 *      required:
 *        - email
 *        - role
 *        - companyName
 *        - fileNumber
 *        - firstName
 *        - lastName
 *        - startDate
 *        - endDate
 *        - categories
 *        - city
 *        - phoneNumber
 *      properties:
 *        role:
 *          type: string
 *          default: USER
 *        email:
 *          type: string
 *          default: decoder314@gmail.com
 *        fileNumber:
 *          type: string
 *        startDate:
 *          type: string
 *        endDate:
 *          type: string
 *    CreateUserResponse:
 *        type: object
 *        properties:
 *          email:
 *            type: string
 *          _id:
 *            type: string
 *          createdAt:
 *            type: string
 *          updatedAt:
 *            type: string
 */
export const createUserSchema = object({
  body: object({
    email: string({
      required_error: 'E-Mail is required',
    }).email(),
    role: string({
      required_error: 'Role is required',
    }),
    companyName: string({
      required_error: 'Company name is required',
    }).optional(),
    fileNumber: number({
      required_error: 'File number is required',
    }).optional(),
    firstName: string({
      required_error: 'First name is required',
    }).optional(),
    lastName: string({
      required_error: 'Last name is required',
    }).optional(),
    city: string({
      required_error: 'City/Region is required',
    }).optional(),
    companyLicenseNumber: string({}).optional(),
    categories: array(
      object({
        id: string(),
        name: string(),
      }),
    ).optional(),
    startDate: string({
      required_error: 'Start date is required',
    }).optional(),
    endDate: string({
      required_error: 'End date is required',
    }).optional(),
  }).refine(
    data => {
      if (!Object.values<string>(Role).includes(data.role)) {
        return false;
      } else {
        return true;
      }
    },
    {
      message: 'Not a valid user role',
    },
  ),
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
 *    ToggleDisableUserResponse:
 *      type: object
 *      properties:
 *        message:
 *          type: string
 */
export const toggleUserDisableSchema = object({
  ...params,
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

export type CreateUserInput = TypeOf<typeof createUserSchema>;
export type UpdateUserInput = Partial<TypeOf<typeof updateUserSchema>>;
export type UpdateOtherUserInput = Partial<TypeOf<typeof updateOtherUserSchema>>;
export type ListUsersInput = TypeOf<typeof listUsersSchema>;
export type GetUsersInput = TypeOf<typeof getUserSchema>;
export type ToggleUserDisableInput = TypeOf<typeof toggleUserDisableSchema>;
export type DeleteUserInput = TypeOf<typeof deleteUserSchema>;
