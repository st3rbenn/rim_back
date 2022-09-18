import express, { Express } from 'express';
import { register, login } from '../controller/AuthController.js';

const AuthRouter: Express = express();

AuthRouter
  .post('/signup', register)
  .post('/login', login)


export default AuthRouter;