import { Job } from 'bull';
// import { sendMailQueue } from '../../../config/bull';
import { SendEmailJobData } from '../../@types';
import { logger, sendEmail } from '../../utils';

// sendMailQueue.process(async (job: Job<SendEmailJobData>) => {
//   logger.debug(job.data);
//   return await consumer(job.data);
// });

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
