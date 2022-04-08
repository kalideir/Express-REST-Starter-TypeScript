/* eslint-disable @typescript-eslint/no-var-requires */
import express from 'express';
import fs from 'fs';
import httpStatus from 'http-status';
import { logger } from '../utils';
import authRoutes from './auth.route';
import settingRoutes from './setting.route';
import userRoutes from './user.route';
import pageRoutes from './page.route';
import postRoutes from './post.route';
import mediaRoutes from './media.route';
import contactRoutes from './contact.route';
import swaggerRoutes from './swagger.route';
const router = express.Router();

/**
 * Health check
 */
router.get('/', (req, res) => {
  res.send(httpStatus.OK);
});

router.use('/auth', authRoutes);
router.use('/setting', settingRoutes);
router.use('/user', userRoutes);
router.use('/page', pageRoutes);
router.use('/media', mediaRoutes);
router.use('/post', postRoutes);
router.use('/contact', contactRoutes);
router.use('/swagger', swaggerRoutes);

export default router;
