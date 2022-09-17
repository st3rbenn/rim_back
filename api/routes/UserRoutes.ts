import express, { Express } from 'express';
import { findAllUsers, findOneById, createUser, editUser, deleteUser, findAllConversationFromUser } from '../controller/UserController.js';

const UserRouter: Express = express();

UserRouter
  .get('/', findAllUsers)
  .get('/:id', findOneById)
  .get('/:id/conversations', findAllConversationFromUser)
  .post('/', createUser)
  .put('/:id', editUser)
  .delete('/:id', deleteUser)


export default UserRouter;