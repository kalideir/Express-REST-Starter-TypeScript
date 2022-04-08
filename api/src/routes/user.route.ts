import { Router } from 'express';
import * as controller from '../controllers/user.controller';
import { requireAdmin, requireStaff, requireUser, validate } from '../middleware';
import { createUserSchema, listUsersSchema, updateUserSchema, getUserSchema, toggleUserDisableSchema, deleteUserSchema } from '../schema';

const router = Router();

/**
 * @swagger
 * /user:
 *   post:
 *     tags:
 *       - Users
 *     summary: Create new user
 *     security:
 *       - Bearer: []
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/CreateUserInput'
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                  allOf:
 *                      - $ref: '#/components/schemas/CreateUserResponse'
 *      409:
 *        description: Conflict
 *      400:
 *        description: Bad request
 */
router.post('/', requireStaff, validate(createUserSchema), controller.create);

/**
 * @swagger
 * /user:
 *   patch:
 *     tags:
 *       - Users
 *     summary: Update new user
 *     security:
 *       - Bearer: []
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/UpdateUserInput'
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                  allOf:
 *                      - $ref: '#/components/schemas/UpdateUserResponse'
 *      409:
 *        description: Conflict
 *      400:
 *        description: Bad request
 */
router.patch('/', requireUser, validate(updateUserSchema), controller.update);

/**
 * @swagger
 * /user/updateUser/{id}:
 *   patch:
 *     tags:
 *       - Users
 *     summary: Update new user
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/UpdateUserInput'
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                  allOf:
 *                      - $ref: '#/components/schemas/UpdateUserResponse'
 *      409:
 *        description: Conflict
 *      400:
 *        description: Bad request
 */
router.patch('/updateUser/:id', requireStaff, validate(updateUserSchema), controller.updateUserHandler);

router.patch('/', requireAdmin, validate(createUserSchema), controller.create);

router.delete('/:id', requireStaff, validate(deleteUserSchema), controller.deleteUser);

/**
 * @swagger
 * /user/list/users:
 *   get:
 *     tags:
 *       - Users
 *     summary: List all pages
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - name: role
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *       - name: page
 *         in: query
 *         schema:
 *           type: number
 *       - name: limit
 *         in: query
 *         schema:
 *           type: number
 *       - name: search
 *         in: query
 *         schema:
 *           type: string
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                  allOf:
 *                      - $ref: '#/components/schemas/ListUsersResponse'
 *      409:
 *        description: Conflict
 *      400:
 *        description: Bad request
 */
router.get('/list/users', requireStaff, validate(listUsersSchema), controller.listUsers);

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get user data by id
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                  allOf:
 *                      - $ref: '#/components/schemas/GetUserResponse'
 *      409:
 *        description: Conflict
 *      400:
 *        description: Bad request
 */
router.get('/:id', requireUser, validate(getUserSchema), controller.get);

/**
 * @swagger
 * /user/toggleDisable/{id}:
 *   patch:
 *     tags:
 *       - Users
 *     summary: Disable user by id
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *      409:
 *        description: Conflict
 *      400:
 *        description: Bad request
 */
router.patch('/toggleDisable/:id', requireStaff, validate(toggleUserDisableSchema), controller.toggleDisable);

export default router;
