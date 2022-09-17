import express, { Express } from 'express';
import { findAllUsers, findOneById, createUser, editUser, deleteUser, findAllConversationFromUser, sendMessageOnConversation, editMessageOnConversation, deleteMessageOnConversation } from '../controller/UserController.js';

const UserRouter: Express = express();

UserRouter
  .get('/', findAllUsers)
  .get('/:id', findOneById)
  .get('/:id/conversations', findAllConversationFromUser)
  .post('/add', createUser)
  .post('/add/message', sendMessageOnConversation)
  .put('/edit/:id', editUser)
  .put('/edit/message/:id', editMessageOnConversation)
  .delete('/delete/:id', deleteUser)
  .delete('/delete/message/:id', deleteMessageOnConversation)


export default UserRouter;