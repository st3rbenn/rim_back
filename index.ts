import express, {Express, Request, Response} from 'express';
import compression from 'compression';
import helmet from 'helmet';
import dotenv from 'dotenv';
import cors from 'cors';
import db from './api/sequelize.js';
import Router from './api/Router.js';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';

dotenv.config();

export const app: Express = express();
const port: string | undefined = process.env.PORT;
db();

// if (process.env.NODE_ENV !== 'production') {
//   console.log('JWT', generateToken());
// }

// compresses all the responses
app.use(compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      // don't compress responses with this request header
      return false;
    }

    // fallback to standard filter function
    return compression.filter(req, res);
  },
}));

// adding set of security middlewares
app.use(helmet({
  contentSecurityPolicy: false,
}));
app.use('/assets/uploads', express.static('assets/uploads'));
// adding cors middleware
app.use(cors({}));

// adding cookie parser middleware
app.use(cookieParser());

// adding file upload middleware
app.use(fileUpload());

// adding body parser middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api/v1/', Router);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running ...`);
});
