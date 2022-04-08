import { SendEmailContext } from '../../@types';
import { SendMailOptions } from 'nodemailer';
// import { sendMailQueue } from '../../../config/bull';

export default function (emailOptions: SendMailOptions, context: SendEmailContext) {
  const data = { emailOptions, context };
  const opts = {
    attempts: 1,
  };
  // sendMailQueue.add(data, opts);
}
