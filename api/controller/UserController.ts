import {Request, Response} from 'express';
import Bcrypt from 'bcrypt';
import {
  deleteMessage,
  editMessage,
  sendMessage,
  follow,
  unFollow,
  findAllFollowedByUserId,
} from '../services/UserServices.js';
import {User} from '../models/UserModel.js';
import {UserConversationLinks} from '../models/UserConversationLinksModel.js';
import {Conversation} from '../models/ConversationModel.js';
import UserType from '../../types/UserType.js';
import {UserFollowLinks} from '../models/UserFollowLinksModel.js';
import * as dotenv from 'dotenv';
import { Post } from '../models/PostModel.js';
import { UserPostLinks } from '../models/UserPostLinksModel.js';

dotenv.config();

export const findAllUsers = async (req: Request, res: Response) => {
  let canFindAllUser = true;
  try {
    const users = await User.findAll();

    if (users.length === 0) {
      res.status(404).json({
        message: 'No users found',
      });
      canFindAllUser = true;
    }

    if (canFindAllUser) {
      res.status(200).json({
        message: 'All users retrieved successfully',
        users,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving users',
      error,
    });
    throw error;
  }
};

export const findOneById = async (req: Request, res: Response) => {
  let canUserBeFoundById = true;
  let posts: any = [];
  try {
    const {userId} = req.params;

    const user = await User.findOne({
      where: {
        id: userId,
      },
      attributes: {
        exclude: ['password'],
      },
    });

    const allPosts = await UserPostLinks.findAll({
      where: {
        userId: userId,
      },
    });

    for (const post of allPosts) {
      const postFound = await Post.findOne({
        where: {
          id: Object(post).dataValues.postId,
        },
      });
      posts.push(postFound);
    }

    posts.sort((a: any, b: any) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    if (!user) {
      canUserBeFoundById = false;
      return res.status(404).json({
        message: 'User not found',
      });
    }

    const nbFollowers = await UserFollowLinks.count({
      where: {
        followedId: userId,
      },
    });

    const nbFollowed = await UserFollowLinks.count({
      where: {
        followerId: userId,
      },
    });

    if (canUserBeFoundById) {
      return res.status(200).json({
        message: `User ${user?.get('pseudo')} retrieved successfully`,
        user : {
          ...user.get(),
          nbFollowers, 
          nbFollowed,
        },
        posts,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving user',
      error,
    });
    throw error;
  }
};

interface editUserType {
  userId?: number;
  firstName?: string;
  pseudo?: string;
  email?: string;
  avatar?: string;
  biography?: string;
  birthDate?: Date;
  password?: string;
}

export const editUser = async (req: Request, res: Response) => {
  let canUserBeEdited = true;
  let currentBodyValues: editUserType = {};
  try {
    const reqBody: editUserType = req.body;
    console.log(req);
    if (!reqBody.userId) {
      canUserBeEdited = false;
      return res.status(400).json({
        message: 'The userId is required',
      });
    }

    for (const [key, value] of Object.entries(reqBody)) {
      if (key) {
        currentBodyValues[key as keyof editUserType] = value;
      }
    }

    if(currentBodyValues.password) {
      currentBodyValues.password = await Bcrypt.hash(currentBodyValues.password, 10);
    }

    if(currentBodyValues.email) {
      const user = await User.findOne({
        where: {
          email: currentBodyValues.email,
        },
      });

      if(user) {
        canUserBeEdited = false;
        return res.status(400).json({
          message: 'This email is already used',
        });
      }
    }

    if(currentBodyValues.pseudo) {
      const user = await User.findOne({
        where: {
          pseudo: currentBodyValues.pseudo,
        },
      });

      if(user) {
        canUserBeEdited = false;
        return res.status(400).json({
          message: 'This pseudo is already used',
        });
      }
    }

    if (canUserBeEdited) {

      await User.update(
        currentBodyValues,
        {
          where: {
            id: reqBody.userId,
          },
        },
      );

      const nbFollowers = await UserFollowLinks.count({
        where: {
          followedId: reqBody.userId,
        },
      });
  
      const nbFollowed = await UserFollowLinks.count({
        where: {
          followerId: reqBody.userId,
        },
      });

      const findUser = await User.findOne({
        where: {
          id: reqBody.userId,
        },
        attributes: {
          exclude: ['password'],
        },
      });

      return res.status(200).json({
        message: 'User updated successfully',
        user: {
          ...findUser?.get(),
          nbFollowers, 
          nbFollowed,
        },
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Error updating user',
      error,
    });
    throw error;
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  let canUserBeDeleted = true;
  try {
    const {userId} = req.body;

    if (!userId) {
      res.status(400).json({
        message: `Missing parameters : user Id`,
      });
      canUserBeDeleted = false;
    }

    const currentUser: UserType | null = await User.findOne({
      where: {
        id: userId,
      },
    });

    if (!currentUser) {
      res.status(400).json({
        message: `User not found`,
      });
      canUserBeDeleted = false;
    }

    if (canUserBeDeleted) {
      await User.destroy({
        where: {
          id: userId,
        },
      });

      res.status(200).json({
        message: `User ${currentUser?.email} deleted successfully`,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: `Error while deleting user with id: ${req.params.id}`,
      error,
    });
    throw error;
  }
};

export const findAllConversationFromUser = async (req: Request, res: Response) => {
  let canFindAllConversationFromAUser = true;
  try {
    const {userId} = req.body;

    if (!userId) {
      res.status(400).json({
        message: `Missing parameters : user Id`,
      });
      canFindAllConversationFromAUser = false;
    }

    const findUser = await User.findOne({
      where: {
        id: userId,
      },
    });

    const allConversations = await UserConversationLinks.findAll({
      where: {
        userId: userId,
      },
    });

    if (!findUser) {
      res.status(404).json({
        message: 'User not found',
      });
      canFindAllConversationFromAUser = false;
    }

    if (allConversations.length === 0) {
      res.status(404).json({
        message: 'No conversations found',
      });
      canFindAllConversationFromAUser = false;
    }

    if (canFindAllConversationFromAUser) {
      res.status(200).json({
        message: 'All conversations retrieved successfully',
        allConversations,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving conversations',
      error,
    });
    throw error;
  }
};

export const sendMessageOnConversation = async (req: Request, res: Response) => {
  let canMessagebeSend = true;
  try {
    const reqBody = {
      userId: req.body.userId,
      conversationId: req.body.conversationId,
      message: req.body.message,
    };

    for (const [key, value] of Object.entries(reqBody)) {
      if (!value) {
        canMessagebeSend = false;
        return res.status(400).json({
          message: `Missing param : ${key}`,
        });
      }
    }

    const user = await User.findOne({
      where: {
        id: reqBody.userId,
      },
    });

    const conversation = await Conversation.findOne({
      where: {
        id: reqBody.conversationId,
      },
    });

    const userHaveConversation = await UserConversationLinks.findAll({
      where: {
        userId: reqBody.userId,
        conversationId: reqBody.conversationId,
      },
    });

    if (!user) {
      res.status(404).json({
        message: 'User not found',
      });
      canMessagebeSend = false;
    }

    if (!conversation) {
      res.status(404).json({
        message: 'Conversation not found',
      });
      canMessagebeSend = false;
    }

    if (userHaveConversation.length === 0) {
      res.status(403).json({
        message: 'User is not part of this conversation',
      });
      canMessagebeSend = false;
    }

    if (canMessagebeSend) {
      const Message = await sendMessage(reqBody.conversationId, reqBody.userId, reqBody.message);
      res.status(200).json({
        message: 'Message sent successfully',
        Message,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Error sending message',
      error,
    });
    throw error;
  }
};

export const editMessageOnConversation = async (req: Request, res: Response) => {
  let canUserEditMessage = true;
  try {
    const reqBody = {
      userId: req.body.userId,
      conversationId: req.body.conversationId,
      messageId: req.body.messageId,
      message: req.body.message,
    };

    for (const [key, value] of Object.entries(reqBody)) {
      if (!value) {
        canUserEditMessage = false;
        return res.status(400).json({
          message: `Missing param : ${key}`,
        });
      }
    }

    const user = await User.findOne({
      where: {
        id: reqBody.userId,
      },
    });

    const conversation = await Conversation.findOne({
      where: {
        id: reqBody.conversationId,
      },
    });

    const linksBetweenConversationAndUser = await UserConversationLinks.findAll({
      where: {
        userId: reqBody.userId,
        conversationId: reqBody.conversationId,
      },
    });

    if (!user) {
      canUserEditMessage = false;
      return res.status(404).json({
        message: 'User not found',
      });
    }

    if (!conversation) {
      canUserEditMessage = false;
      return res.status(404).json({
        message: 'Conversation not found',
      });
    }

    if (linksBetweenConversationAndUser.length === 0) {
      canUserEditMessage = false;
      return res.status(403).json({
        message: 'User is not part of this conversation',
      });
    }

    if (canUserEditMessage) {
      const msg = await editMessage(reqBody.messageId, reqBody.message);
      return res.status(200).json({
        message: 'Message edited successfully',
        msg,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Error editing message',
      error,
    });
    throw error;
  }
};

export const deleteMessageOnConversation = async (req: Request, res: Response) => {
  let canMessageBeDeleted = true;
  try {
    const reqBody = {
      userId: req.body.userId,
      conversationId: req.body.conversationId,
      messageId: req.body.messageId,
    };

    for (const [key, value] of Object.entries(reqBody)) {
      if (!value) {
        canMessageBeDeleted = false;
        return res.status(400).json({
          message: `Missing param : ${key}`,
        });
      }
    }

    const user = await User.findOne({
      where: {
        id: reqBody.userId,
      },
    });

    const conversation = await Conversation.findOne({
      where: {
        id: reqBody.conversationId,
      },
    });

    const linksBetweenConversationAndUser = await UserConversationLinks.findAll({
      where: {
        userId: reqBody.userId,
        conversationId: reqBody.conversationId,
      },
    });

    if (!user) {
      canMessageBeDeleted = false;
      return res.status(404).json({
        message: 'User not found',
      });
    }

    if (!conversation) {
      canMessageBeDeleted = false;
      return res.status(404).json({
        message: 'Conversation not found',
      });
    }

    if (linksBetweenConversationAndUser.length === 0) {
      canMessageBeDeleted = false;
      return res.status(403).json({
        message: 'User is not part of this conversation',
      });
    }

    if (canMessageBeDeleted) {
      await deleteMessage(reqBody.messageId);

      return res.status(200).json({
        message: 'Message deleted successfully',
      });
    }
  } catch (error) {
    throw res.status(500).json({
      message: 'Error deleting message',
      error,
    });
  }
};

export const followUser = async (req: Request, res: Response) => {
  let canUserBeFollowed = true;
  try {
    const reqBody = {
      followerId: req.body.followerId,
      followedId: req.body.followedId,
    };

    for (const [key, value] of Object.entries(reqBody)) {
      if (!value) {
        canUserBeFollowed = false;
        return res.status(400).json({
          message: `Missing param : ${key}`,
        });
      }
    }

    if (reqBody.followerId === reqBody.followedId) {
      canUserBeFollowed = false;
      return res.status(400).json({
        message: 'You cannot follow yourself',
      });
    }

    const user = await User.findOne({
      where: {
        id: reqBody.followerId,
      },
    });

    const userToFollow = await User.findOne({
      where: {
        id: reqBody.followedId,
      },
    });

    const userRelationship = await UserFollowLinks.findOne({
      where: {
        followerId: reqBody.followerId,
        followedId: reqBody.followedId,
      },
    });

    if (!user) {
      canUserBeFollowed = false;
      return res.status(404).json({
        message: 'User not found',
      });
    }

    if (!userToFollow) {
      canUserBeFollowed = false;
      return res.status(404).json({
        message: 'User to follow not found',
      });
    }

    if (userRelationship) {
      canUserBeFollowed = false;
      return res.status(403).json({
        message: 'User already followed',
      });
    }

    if (canUserBeFollowed) {
      await follow(reqBody.followerId, reqBody.followedId);

      return res.status(200).json({
        message: 'User followed successfully',
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: 'Error following user',
      error,
    });
  }
};

export const unFollowUser = async (req: Request, res: Response) => {
  let canUserBeUnFollowed = true;
  try {
    const reqBody = {
      followerId: req.body.followerId,
      followedId: req.body.followedId,
    };

    for (const [key, value] of Object.entries(reqBody)) {
      if (!value) {
        canUserBeUnFollowed = false;
        return res.status(400).json({
          message: `Missing param : ${key}`,
        });
      }
    }

    if (reqBody.followerId === reqBody.followedId) {
      canUserBeUnFollowed = false;
      return res.status(400).json({
        message: 'You cannot unfollow yourself',
      });
    }

    const user = await User.findOne({
      where: {
        id: reqBody.followerId,
      },
    });

    const userToUnFollow = await User.findOne({
      where: {
        id: reqBody.followedId,
      },
    });

    if (!user) {
      canUserBeUnFollowed = false;
      return res.status(404).json({
        message: 'User not found',
      });
    }

    if (!userToUnFollow) {
      canUserBeUnFollowed = false;
      return res.status(404).json({
        message: 'User to unfollow not found',
      });
    }

    if (canUserBeUnFollowed) {
      await unFollow(reqBody.followerId, reqBody.followedId);

      return res.status(200).json({
        message: 'User unfollowed successfully',
      });
    }
  } catch (error) {
    throw res.status(500).json({
      message: 'Error unfollowing user',
      error,
    });
  }
};

export const findAllfollowedUsers = async (req: Request, res: Response) => {
  let canUsersBeFound = true;
  try {
    const reqBody = {
      userId: req.body.userId,
    };

    for (const [key, value] of Object.entries(reqBody)) {
      if (!value) {
        canUsersBeFound = false;
        return res.status(400).json({
          message: `Missing param : ${key}`,
        });
      }
    }

    const user = await User.findOne({
      where: {
        id: reqBody.userId,
      },
    });

    if (!user) {
      canUsersBeFound = false;
      return res.status(404).json({
        message: 'User not found',
      });
    }

    if (canUsersBeFound) {
      const followedUsers = await findAllFollowedByUserId(reqBody.userId);

      return res.status(200).json({
        message: 'Followed users found successfully',
        followedUsers,
      });
    }
  } catch (error) {
    throw res.status(500).json({
      message: 'Error finding followed users',
      error,
    });
  }
};
