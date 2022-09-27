import express, {Express, Request, Response} from 'express';
import UserRouter from './routes/UserRoutes.js';
import ConversationRouter from './routes/ConversationRoutes.js';
import PostRouter from './routes/PostRoutes.js';
import AuthRouter from './routes/AuthRoutes.js';
import {isAuthtenticated} from './middleware/authJwt.js';

const Router: Express = express();

Router.use('/auth', AuthRouter);

Router.use('/post', isAuthtenticated, PostRouter);

Router.use('/conversation', isAuthtenticated, ConversationRouter);

Router.use('/user', isAuthtenticated, UserRouter);

Router.use('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: "Bienvenue sur l'API de la platforme de messagerie Rim",
  });
});

Router.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    message: 'Page not found',
  });
});

export default Router;
