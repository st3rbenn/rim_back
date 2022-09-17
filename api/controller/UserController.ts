import { findAllConversationByUserId } from './../services/ConversationServices.js';
import sequelize from '../database/Connection.js';
import { Request, Response } from 'express';
import Bcrypt from 'bcrypt';
import { deleteMessage, editMessage, findUserByEmail, findUserById, sendMessage } from '../services/UserServices.js';
import { exit } from 'process';


export const findAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await sequelize.models.User.findAll();
    res.status(200).json({
      message: 'Users retrieved successfully',
      users
    })
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving users',
      error
    })
    throw error;
  }
}

export const findOneById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await findUserById(parseInt(id));
    res.status(200).json({
      message: 'User retrieved successfully',
      user
    })
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving user',
      error
    })
    throw error;
  }
}

export const createUser = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, birthDate } = req.body;

    const same = await findUserByEmail(email);
    if(Object(same).length > 0) {
      res.status(409).json({
        message: 'User already exists'
      })
    } else {
      const hashedPassword = await Bcrypt.hash(password, 10);
      const user = await sequelize.models.User.create({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        birthDate
      });
      res.status(201).json({
        message: 'User created successfully',
        user
      })
    }
  } catch (error) {
    res.status(500).json({
      message: 'Error creating user',
      error
    })
    throw error;
  }
}

export const editUser = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, birthDate } = req.body;

    if (password) {
      const hashedPassword = await Bcrypt.hash(password, 10);
      const user = await sequelize.models.User.update({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        birthDate
      }, {
        where: {
          id: req.params.id
        }
      });
      res.status(200).json({
        message: 'User updated successfully',
        user
      })
    } else {
      const user = await sequelize.models.User.update({
        email,
        firstName,
        lastName,
        birthDate
      }, {
        where: {
          id: req.params.id
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
  try {

    const { id } = req.params;
    const currentUser = await findUserById(parseInt(id));

    const { email } = Object(currentUser).dataValues; 

    await sequelize.models.User.destroy({
      where: {
        id: id
      }
    });

    res.status(200).json({
      message: `User ${email} deleted successfully`
    })
  } catch (error) {
    res.status(500).json({
      message: `Error while deleting user with id: ${req.params.id}`,
      error
    })
    throw error;
  }
}

export const findAllConversationFromUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log(id);
    const allConversations = await findAllConversationByUserId(parseInt(id));
    res.status(200).json({
      message: 'Conversations retrieved successfully',
      allConversations
    })
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving conversations',
      error
    })
    throw error;
  }
}

export const sendMessageOnConversation = async (req: Request, res: Response) => {
  try {
    const { message, userId, conversationId } = req.body;

    if(userId && conversationId) {
      const user = await findUserById(parseInt(userId));
      const conversation = await sequelize.models.Conversation.findOne({
        where: {
          id: conversationId
        }
      });

      const UserConversationLinks = await sequelize.models.UserConversationLinks.findAll({
        where: {
          userId: userId,
          conversationId: conversationId
        }
      });
        if(UserConversationLinks.length === 0) {
          res.status(403).json({
            message: 'User is not part of this conversation'
          })
        } else {
          if(user && conversation) {
            const Message = await sendMessage(conversationId, userId, message);
            res.status(200).json({
              message: 'Message sent successfully',
              Message
            })
          } else {
              res.status(404).json({
                message: 'User or conversation not found'
              })
          }
        }
      } else {
        res.status(400).json({
          message: 'User id and conversation id are required'
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
  try {
    const { message, userId, conversationId, messageId } = req.body;

    if(userId && conversationId && messageId) {
      const user = await findUserById(parseInt(userId));
      const conversation = await sequelize.models.Conversation.findOne({
        where: {
          id: conversationId
        }
      });

      const UserConversationLinks = await sequelize.models.UserConversationLinks.findAll({
        where: {
          userId: userId,
          conversationId: conversationId
        }
      });
        if(UserConversationLinks.length === 0) {
          res.status(403).json({
            message: 'User is not part of this conversation'
          })
        } else {
          if(user && conversation) {
            const Message = await editMessage(messageId, message);
            res.status(200).json({
              message: 'Message edited successfully',
              Message
            })
          } else {
              res.status(404).json({
                message: 'User or conversation not found'
              })
          }
        }
      } else {
        res.status(400).json({
          message: 'User id, conversation id and message id are required'
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
  try {
    const { userId, conversationId, messageId } = req.body;

    if(userId && conversationId && messageId) {
      const user = await findUserById(parseInt(userId));
      const conversation = await sequelize.models.Conversation.findOne({
        where: {
          id: conversationId
        }
      });

      const UserConversationLinks = await sequelize.models.UserConversationLinks.findAll({
        where: {
          userId: userId,
          conversationId: conversationId
        }
      });
        if(UserConversationLinks.length === 0) {
          res.status(403).json({
            message: 'User is not part of this conversation'
          })
        } else {
          if(user && conversation) {

            await deleteMessage(messageId);
            
            res.status(200).json({
              message: 'Message deleted successfully'
            })
          } else {
              res.status(404).json({
                message: 'User or conversation not found'
              })
          }
        }
      } else {
        res.status(400).json({
          message: 'User id, conversation id and message id are required'
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