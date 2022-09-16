import express, { Express, Request, Response } from 'express';
import compression from 'compression';
import helmet from 'helmet';
import dotenv from 'dotenv';
import router from './api/routes.js';
import cors from 'cors';
import * as dbConnect from './config/database/Connection.js'

dotenv.config();

export const app: Express = express();
const port: string | undefined = process.env.PORT;

dbConnect.default();

// compresses all the responses
app.use(compression());

// adding set of security middlewares
app.use(helmet());

// adding cors middleware
app.use(cors());

// adding body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/', router);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}/api/v1/`);
});
