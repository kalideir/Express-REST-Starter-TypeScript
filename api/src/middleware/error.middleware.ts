import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { ApiError } from '../errors';
import { logger, t } from '../utils';

const error = (error: ApiError | Error, req: Request, res: Response) => {
  if (process.env.NODE_ENV !== 'development') {
    delete error.stack;
  }

  logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${error.message}`);

  if (error instanceof ApiError) {
    res.status(error.status).json({ message: error.message });
  }

  res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: t('something_went_wrong') });
};

export default error;
