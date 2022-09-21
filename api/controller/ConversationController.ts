import { Request, Response } from 'express';
import { createRelationBetweenUsersAndConversation, getConversationBetweenUsers } from '../services/relations/UserConversationServices.js';
import { Conversation } from '../models/ConversationModel.js';
import ConversationType from '../../types/ConversationType.js';

export const getConversation = async (req: Request, res: Response) => {
  let canConversationsBeRetrieved = true;
  try {
    const { conversationId } = req.body;

    if(!conversationId) {
      res.status(400).json({
        message: 'Conversation id is required'
      })
      canConversationsBeRetrieved = false;
    }
    const conversations: ConversationType | null = await getConversationBetweenUsers(parseInt(conversationId))

    if(conversations) {
      res.status(400).json({
        message: 'No conversation exists with this id'
      })
      canConversationsBeRetrieved = false;
    }

    if(canConversationsBeRetrieved) {
      res.status(200).json({
        message: 'Conversation retrieved successfully',
        conversations
      })
    }

  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving conversation',
      error
    })
  }
}

export const createNewConversation = async (req: Request, res: Response) => {
  let canConversationBeCreated = true;
  try {
    const reqBody = {
      user1Id: req.body.user1Id,
      user2Id: req.body.user2Id
    };

    if(reqBody.user1Id === reqBody.user2Id) {
      res.status(409).json({
        message: 'You cannot create a conversation with yourself'
      })
      canConversationBeCreated = false;
    }

    if (!reqBody.user1Id || !reqBody.user2Id) {
      res.status(400).json({
        message: 'You must provide two users'
      })
      canConversationBeCreated = false;
    }
    
    
    if(canConversationBeCreated) {
      const conversation: ConversationType | null = await Conversation.create();
      await createRelationBetweenUsersAndConversation([reqBody.user1Id, reqBody.user2Id], conversation.id as number);

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
  let canConversationBeDeleted = true;
  try {
    const { id } = req.params;

    if(!id) {
      res.status(400).json({
        message: `Missing conversation id parameter`
      });
      canConversationBeDeleted = false;
    }

    const currentConversation = await Conversation.findOne({
      where: {
        id: id
      }
    })

    if(!currentConversation) {
      res.status(400).json({
        message: `Conversation does not exist`
      });
      canConversationBeDeleted = false;
    }

    if(canConversationBeDeleted) {

      await Conversation.destroy({
        where: {
          id: id
        }
      });

      res.status(200).json({
        message: 'Conversation deleted successfully',
        currentConversation
      })
    }

  } catch (error) {
    res.status(500).json({
      message: 'Error deleting conversation',
      error
    })
  }
}