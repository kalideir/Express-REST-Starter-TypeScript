import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import sharp from 'sharp';
import { MediaModel } from '../models';
import { CreateMediaInput, DeleteMediaInput, LoadMediaInput } from '../schema';
import { deleteFileFromAWSS3, uploadFileToAWSS3 } from '../services';
import { logger, t } from '../utils';
import { S3 } from 'aws-sdk';

export async function load(req: Request<LoadMediaInput['params']>, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const media = await MediaModel.findById(id);
    res.locals.media = media;
    return next();
  } catch (error) {
    return next(error);
  }
}

export async function get(req, res) {
  res.json(res.locals.media);
}

export async function create(req: Request<CreateMediaInput>, res: Response, next: NextFunction) {
  try {
    const filename = `${Math.floor(Math.random() * 999)}_${Date.now()}_${req.file.originalname.split(' ').join('_')}`;
    const fileType = req.file.mimetype;
    const image: S3.ManagedUpload.SendData = await uploadFileToAWSS3(`${filename}`, fileType, req.file.buffer);
    const payload = { ...req.body, originalUrl: image.Location };
    const savedMedia = await MediaModel.create(payload);
    logger.info(savedMedia.toJSON());
    logger.info(image);
    res.status(httpStatus.CREATED).json({ message: t('file_upload_success'), media: { ...savedMedia.toJSON() } });
  } catch (error) {
    next(error);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const media = Object.assign(res.locals.media, req.body);
    const savedMedia = await media.save();
    res.status(httpStatus.OK);
    res.json(savedMedia);
  } catch (error) {
    next(error);
  }
}

export async function remove(req: Request<DeleteMediaInput['params']>, res: Response) {
  try {
    const { media } = res.locals;
    await deleteFileFromAWSS3(media.originalUrl);
    await media.remove();
    return res.status(httpStatus.OK).send({ message: 'Media har raderats.' });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: 'Något gick fel' });
  }
}

export async function upload(req: Request, res: Response, next: NextFunction) {
  try {
    const filename = `${Math.floor(Math.random() * 999)}_${Date.now()}_${req.file.originalname.split(' ').join('_')}`;
    const fileType = req.file.mimetype;
    const uploadType = req.body.type;
    let image: unknown;
    if (uploadType === 'PROFILE-PICTURE') {
      const buffer = await sharp(req.file.buffer).resize(200, 200).toBuffer();
      image = await uploadFileToAWSS3(`small/${filename}`, fileType, buffer);
    } else {
      image = await uploadFileToAWSS3(`ahlanjobs/${filename}`, fileType, req.file.buffer);
    }
    res.send(image);
  } catch (error) {
    next(error);
  }
}
