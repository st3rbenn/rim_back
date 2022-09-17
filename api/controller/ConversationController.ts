import sequelize from '../database/Connection.js';
import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { createRelationBetweenUsersAndConversation, getConversationBetweenUsers } from '../services/relations/UserConversationServices.js';

export const getConversation = async (req: Request, res: Response) => {
  try {
    const { conversationId } = req.params;

    const conversations = await getConversationBetweenUsers(parseInt(conversationId))
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving conversation',
      error
    })
  }
}

export const createNewConversation = async (req: Request, res: Response) => {
  try {
    const { user1Id, user2Id } = req.body;
    if(user1Id === user2Id) {
      res.status(409).json({
        message: 'You cannot create a conversation with yourself'
      })
    } else if (user1Id === undefined || user2Id === undefined) {
      res.status(400).json({
        message: 'You must provide two users'
      })
    } else {
      const conversation = await sequelize.models.Conversation.create();
      await createRelationBetweenUsersAndConversation([user1Id, user2Id], Object(conversation).dataValues.id);

      res.status(201).json({
        message: 'Conversation created successfully',
        conversation
      })
    }
  } catch (error) {
    res.status(500).json({
      message: 'Error creating conversation',
      error
    })
  }
}

export const deleteConversation  = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const conversation = await sequelize.models.Conversation.destroy({
      where: {
        id: id
      }
    });

    res.status(200).json({
      message: 'Conversation deleted successfully',
      conversation
    })
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting conversation',
      error
    })
  }
}