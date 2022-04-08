export default {
  port: 1337,
  host: 'localhost',
  baseUrl: process.env.BASE_URL || 'http://localhost:1337',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  dbURI: process.env.DB_URI,
  redisUrl: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
  smtp: {
    user: 'Ahlanjobb@gmail.com',
    //user: 'info@ahlanjobb.se',
    //pass: 'mrGxp28l',
    pass: 'omar1958y',
    host: 'smtp.gmail.com',
    // host: 'mail.ahlanjobb.se',
    // 465
    port: 465,
    //secure: true,
  },
  saltWorkFactor: 100,
  secret: process.env.JWT_SECRET || 'local-secret',
  awsAccessId: process.env.AWS_ACCESS_ID || 'AKIAVOWBZWLYU3F5WCX6',
  awsSecretKey: process.env.AWS_SECRET_KEY || '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',
  awsS3BucketName: process.env.AWS_S3_BUCKET_NAME || 'we-skillz-api',
};

// console.log(process.env);
