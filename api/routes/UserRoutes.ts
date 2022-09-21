import express, { Express } from 'express';
import { findAllUsers, findOneById, editUser, deleteUser, findAllConversationFromUser, sendMessageOnConversation, editMessageOnConversation, deleteMessageOnConversation } from '../controller/UserController.js';

const UserRouter: Express = express();

UserRouter
  .get('/', findAllUsers)
  .get('/conversations', findAllConversationFromUser)
  .get('/:id', findOneById)
  .post('/add/message', sendMessageOnConversation)
  .put('/edit/:id', editUser)
  .put('/edit/message/:id', editMessageOnConversation)
  .delete('/delete', deleteUser)
  .delete('/delete/message/:id', deleteMessageOnConversation)


export default UserRouter;