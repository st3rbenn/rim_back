import express, { Express, Request, Response } from 'express';
import compression from 'compression';
import helmet from 'helmet';
import dotenv from 'dotenv';
import cors from 'cors';
import db from './api/sequelize.js';
import Router from './api/Router.js';
import cookieParser from 'cookie-parser';

dotenv.config();

export const app: Express = express();
const port: string | undefined = process.env.PORT;
db();

// if (process.env.NODE_ENV !== 'production') {
//   console.log('JWT', generateToken());
// }

// compresses all the responses
app.use(compression());
// adding set of security middlewares
app.use(helmet());
// adding cors middleware
app.use(cors());

app.use(cookieParser());

// adding body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/', Router);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running ...`);
});
