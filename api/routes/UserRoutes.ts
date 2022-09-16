import { Router } from 'express';
import * as UserController from '../controller/UserController.js';

const router = Router();

router
  .route('/')
  .get(UserController.getUsers);

router
  .route('/:id')
  .get(UserController.getUserById);


export default router;