const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;
const NODE_ENV = process.env.NODE_ENV;
const REG_KEY = process.env.REG_KEY;
const JWT_SECRET = process.env.JWT_SECRET;
const AWS_REGION = process.env.AWS_REGION;
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const AWS_URL = process.env.AWS_URL;
const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const EMAIL_HOST = process.env.EMAIL_HOST;
const EMAIL_PORT = process.env.EMAIL_PORT;

module.exports = {
  PORT,
  MONGODB_URI,
  NODE_ENV,
  REG_KEY,
  JWT_SECRET,
  AWS_REGION,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_URL,
  AWS_BUCKET_NAME,
  EMAIL_HOST,
  EMAIL_PASS,
  EMAIL_PORT,
  EMAIL_USER,
};
