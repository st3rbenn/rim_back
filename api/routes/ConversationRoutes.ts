import express, { Express } from 'express';
import { createNewConversation, getConversation, deleteConversation } from '../controller/ConversationController.js';

const ConversationRouter: Express = express();

ConversationRouter
  .get('/', getConversation)
  .post('/', createNewConversation)
  .delete('/:id', deleteConversation)

export default ConversationRouter;