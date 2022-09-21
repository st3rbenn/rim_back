import { Request, Response } from 'express';
import Bcrypt from 'bcrypt';
import { deleteMessage, editMessage, sendMessage } from '../services/UserServices.js';
import { User } from '../models/UserModel.js';
import { UserConversationLinks } from '../models/UserConversationLinksModel.js';
import { Conversation } from '../models/ConversationModel.js';
import UserType from '../../types/UserType.js';


export const findAllUsers = async (req: Request, res: Response) => {
  let canFindAllUser = true;
  try {
    const users = await User.findAll();

    if(users.length === 0) {
      res.status(404).json({
        message: 'No users found'
      })
      canFindAllUser = true;
    } 

    if(canFindAllUser) {
      res.status(200).json({
        message: 'All users retrieved successfully',
        users
      })
    }

  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving users',
      error
    })
    throw error;
  }
}

export const findOneById = async (req: Request, res: Response) => {
  let canUserBeFoundById = true;
  try {
    const { id } = req.params;

    const user = await User.findOne({
      where: {
        id: id
      }
    });

    if(!user) {
      res.status(404).json({
        message: 'User not found'
      })
      canUserBeFoundById = false;
    }

    if(canUserBeFoundById) {
      res.status(200).json({
        message: `User ${user?.get('pseudo')} retrieved successfully`,
        user
      })
    }

  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving user',
      error
    })
    throw error;
  }
}

export const editUser = async (req: Request, res: Response) => {
  let canUserBeEdited = true;
  try {
    const reqBody = {
      pseudo: req.body.pseudo,
      email: req.body.email,
      password: req.body.password,
      birthDate: req.body.birthDate,
    }

    for(const [key, value] of Object.entries(reqBody)) {
      if(!value) {
        canUserBeEdited = false;
        return res.status(400).json({
          message: `Missing parameters : ${key}`
        })
      }
    }

    const currentPassword = await User.findOne({
      where: {
        email: reqBody.email
      }
    });

    const passwordMatch = await Bcrypt.compare(reqBody.password, currentPassword?.get('password') as string);

    if(!reqBody.password) {
      res.status(400).json({
        message: 'Password is required'
      })
      canUserBeEdited = false;
    }

    if(!passwordMatch) {
      res.status(400).json({
        message: 'Password is incorrect'
      })
      canUserBeEdited = false;
    }

    if(canUserBeEdited) {
      const user = await User.update({
        pseudo: reqBody.pseudo,
        birthDate: reqBody.birthDate
      }, {
        where: {
          email: reqBody.email
        }
      });

      res.status(200).json({
        message: 'User updated successfully',
        user
      })
    }


  } catch (error) {
    res.status(500).json({
      message: 'Error updating user',
      error
    })
    throw error;
  }
}

export const deleteUser = async (req: Request, res: Response) => {
  let canUserBeDeleted = true;
  try {

    const { userId } = req.body;

    if(!userId) {
      res.status(400).json({
        message: `Missing parameters : user Id`
      });
      canUserBeDeleted = false;
    }

    const currentUser: UserType | null  = await User.findOne({
      where: {
        id: userId
      }
    });

    if(!currentUser) {
      res.status(400).json({
        message: `User not found`
      });
      canUserBeDeleted = false;
    }
    
    if(canUserBeDeleted) {
      await User.destroy({
        where: {
          id: userId
        }
      })
  
      res.status(200).json({
        message: `User ${currentUser?.email} deleted successfully`
      })
    }
    
  } catch (error) {
    res.status(500).json({
      message: `Error while deleting user with id: ${req.params.id}`,
      error
    })
    throw error;
  }
}

export const findAllConversationFromUser = async (req: Request, res: Response) => {
  let canFindAllConversationFromAUser = true;
  try {
    const { userId } = req.body;
    
    if(!userId) {
      res.status(400).json({
        message: `Missing parameters : user Id`
      });
      canFindAllConversationFromAUser = false;
    }

    const findUser = await User.findOne({
      where: {
        id: userId
      }
    });

    const allConversations = await UserConversationLinks.findAll({
      where: {
        userId: userId,
      },
    });

    if(!findUser) {
      res.status(404).json({
        message: 'User not found'
      })
      canFindAllConversationFromAUser = false;
    }

    if(allConversations.length === 0) {
      res.status(404).json({
        message: 'No conversations found'
      })
      canFindAllConversationFromAUser = false;
    }

    if(canFindAllConversationFromAUser) {
      res.status(200).json({
        message: 'All conversations retrieved successfully',
        allConversations
      })
    }

  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving conversations',
      error
    })
    throw error;
  }
}

export const sendMessageOnConversation = async (req: Request, res: Response) => {
  let canMessagebeSend = true;
  try {
    const reqBody = {
      userId: req.body.userId,
      conversationId: req.body.conversationId,
      message: req.body.message
    }
    
    for(const [key, value] of Object.entries(reqBody)) {
      if(!value) {
        canMessagebeSend = false;
        return res.status(400).json({
          message: `Missing param : ${key}`
        })
      }
    }

    const user = await User.findOne({
      where: {
        id: reqBody.userId
      }
    });

    const conversation = await Conversation.findOne({
      where: {
        id: reqBody.conversationId
      }
    });

    const userHaveConversation = await UserConversationLinks.findAll({
      where: {
        userId: reqBody.userId,
        conversationId: reqBody.conversationId
      }
    });

    if(!user) {
      res.status(404).json({
        message: 'User not found'
      })
      canMessagebeSend = false;
    }

    if(!conversation) {
      res.status(404).json({
        message: 'Conversation not found'
      })
      canMessagebeSend = false;
    }

    if(userHaveConversation.length === 0) {
      res.status(403).json({
        message: 'User is not part of this conversation'
      })
      canMessagebeSend = false;
    } 
    
    if(canMessagebeSend){
        const Message = await sendMessage(reqBody.conversationId, reqBody.userId, reqBody.message);
        res.status(200).json({
          message: 'Message sent successfully',
          Message
        })
      }
    } catch (error) {
    res.status(500).json({
      message: 'Error sending message',
      error
    })
    throw error;
  }
}

export const editMessageOnConversation = async (req: Request, res: Response) => {
  let canUserEditMessage = true;
  try {
    const reqBody = {
      userId: req.body.userId,
      conversationId: req.body.conversationId,
      messageId: req.body.messageId,
      message: req.body.message
    };

    for(const [key, value] of Object.entries(reqBody)) {
      if(!value) {
        canUserEditMessage = false;
        return res.status(400).json({
          message: `Missing param : ${key}`
        })
      }
    }

    const user = await User.findOne({
      where: {
        id: reqBody.userId
      }
    });

    const conversation = await Conversation.findOne({
      where: {
        id: reqBody.conversationId
      }
    });

    const linksBetweenConversationAndUser = await UserConversationLinks.findAll({
      where: {
        userId: reqBody.userId,
        conversationId: reqBody.conversationId
      }
    });

    if(!user) {
      canUserEditMessage = false;
      return res.status(404).json({
        message: 'User not found'
      })
    }

    if(!conversation) {
      canUserEditMessage = false;
      return res.status(404).json({
        message: 'Conversation not found'
      })
    }

    if(linksBetweenConversationAndUser.length === 0) {
      canUserEditMessage = false;
      return res.status(403).json({
        message: 'User is not part of this conversation'
      })
    }

    if(canUserEditMessage) {
      const msg = await editMessage(reqBody.messageId, reqBody.message);
      return res.status(200).json({
        message: 'Message edited successfully',
        msg
      })
    }
  } catch (error) {
    res.status(500).json({
      message: 'Error editing message',
      error
    })
    throw error;
  }
}

export const deleteMessageOnConversation = async (req: Request, res: Response) => {
  let canMessageBeDeleted = true;
  try {
    const reqBody = {
      userId: req.body.userId,
      conversationId: req.body.conversationId,
      messageId: req.body.messageId
    };

    for(const [key, value] of Object.entries(reqBody)) {
      if(!value) {
        canMessageBeDeleted = false;
        return res.status(400).json({
          message: `Missing param : ${key}`
        })
      }
    }

    const user = await User.findOne({
      where: {
        id: reqBody.userId
      }
    });

    const conversation = await Conversation.findOne({
      where: {
        id: reqBody.conversationId
      }
    });

    const linksBetweenConversationAndUser = await UserConversationLinks.findAll({
      where: {
        userId: reqBody.userId,
        conversationId: reqBody.conversationId
      }
    });

    if(!user) {
      res.status(404).json({
        message: 'User not found'
      })
      canMessageBeDeleted = false;
    }

    if(!conversation) {
      res.status(404).json({
        message: 'Conversation not found'
      })
      canMessageBeDeleted = false;
    }

    if(linksBetweenConversationAndUser.length === 0) {
      res.status(403).json({
        message: 'User is not part of this conversation'
      })
      canMessageBeDeleted = false;
    }

    if(canMessageBeDeleted) {
      await deleteMessage(reqBody.messageId);
        
      res.status(200).json({
        message: 'Message deleted successfully'
      })
    }
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting message',
      error
    })
    throw error;
  }
}