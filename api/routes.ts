import express, { Request, Response } from 'express';
import UserRoutes from './routes/UserRoutes.js';

const router = express.Router();

router.use('/user', UserRoutes);

/* router.use('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Welcome to the API'
    })
}); */

export default router;