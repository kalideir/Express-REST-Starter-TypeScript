export default {
  port: process.env.PORT || 8000,
  dbURI: process.env.DB_URI || 'mongodb://localhost:27017',
  redisUrl: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
  logDir: '../logs',
  email: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_IS_SECURE,
  },
  saltWorkFactor: 100,
  jwtSecret: process.env.JWT_SECRET || 'secret',
  awsAccessId: process.env.AWS_ACCESS_ID || '',
  awsSecretKey: process.env.AWS_SECRET_KEY || '',
  awsS3BucketName: process.env.AWS_S3_BUCKET_NAME || '',

  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleGoogleSecret: process.env.GOOGLE_CLIENT_SECRET,
  googleCallbackURL: process.env.GOOGLE_CALLBACK_URL,

  cookieName: process.env.COOKIE_NAME || 'authCookie',
  cookieKey1: process.env.COOKIE_KEY_ID || 'cookie-key-1',
};
