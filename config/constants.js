import 'dotenv/config';

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import bcryptjs from 'bcryptjs';
import Validator from 'validatorjs';
import connectDB from './connectDB.js';
import messages from '../config/locals/en.json' assert { type: 'json' };

const app = express();
const router = express.Router();

const SaltRounds = Number(process.env.BCRYPT_SALT_ROUNDS);

const ResponseCodes = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
  FORCE_LOGOUT: 303,
};

const Roles = {
  Admin: 'admin',
  User: 'user',
};

const EventCodes = {
  USER_SIGNUP: 1,
  USER_LOGIN: 2,
  CHANGE_PASSWORD: 3,
};

export {
  express,
  mongoose,
  cors,
  cookieParser,
  jwt,
  uuidv4,
  bcryptjs,
  Validator,
  connectDB,
  messages,
  app,
  router,
  SaltRounds,
  ResponseCodes,
  Roles,
  EventCodes,
};
