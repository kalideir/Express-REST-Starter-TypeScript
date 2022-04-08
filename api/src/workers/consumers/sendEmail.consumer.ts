import { Job } from 'bull';
import { logger, sendEmail } from '../../utils';
import { sendMailQueue } from '../bull';

export type SendEmailJobData = {
  emailOptions: any;
  context: any;
};

sendMailQueue.process(async (job: Job<SendEmailJobData>) => {
  logger.debug(job.data);
  return await consumer(job.data);
});

export default function consumer(jobData: SendEmailJobData) {
  return new Promise((resolve, reject) => {
    const { emailOptions, context } = jobData;
    try {
      sendEmail(emailOptions, context);
      resolve(true);
    } catch (e) {
      logger.error(e);
      reject(e);
    }
  });
}
