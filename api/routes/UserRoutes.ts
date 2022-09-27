import express, {Express} from 'express';
import {
  findAllUsers,
  findOneById,
  editUser,
  deleteUser,
  findAllConversationFromUser,
  sendMessageOnConversation,
  editMessageOnConversation,
  deleteMessageOnConversation,
  followUser,
  unFollowUser,
  findAllfollowedUsers
} from '../controller/UserController.js';

const UserRouter: Express = express();

UserRouter
  .get('/:userId', findOneById)
  .get('/all', findAllUsers)
  .get('/conversations', findAllConversationFromUser)
  .post('/add/message', sendMessageOnConversation)
  .post('/edit', editUser)
  .put('/edit/message/:id', editMessageOnConversation)
  .delete('/delete', deleteUser)
  .delete('/delete/message/:id', deleteMessageOnConversation);

UserRouter
  .get('/follow', findAllfollowedUsers)
  .post('/follow', followUser)
  .delete('/unfollow', unFollowUser);

export default UserRouter;
