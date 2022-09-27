import {Message} from '../models/MessageModel.js';
import {UserFollowLinks} from '../models/UserFollowLinksModel.js';
import {createRelationBetweenConversationAndMessage} from './relations/ConversationMessageServices.js';

export const sendMessage = async (conversationId: number, userId: number, messageSend: string) => {
  try {
    const message = await Message.create({
      message: messageSend,
      userId: userId,
    });

    await createRelationBetweenConversationAndMessage(conversationId, Object(message).dataValues.id);
    return message;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const editMessage = async (messageId: number, message: string) => {
  try {
    const messageEdited = await Message.update(
      {
        message: message,
      },
      {
        where: {
          id: messageId,
        },
      },
    );
    return messageEdited;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteMessage = async (messageId: number) => {
  try {
    const messageDeleted = await Message.destroy({
      where: {
        id: messageId,
      },
    });
    return messageDeleted;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const follow = async (followerId: number, followedId: number) => {
  try {
    const follow = await UserFollowLinks.create({
      followerId: followerId,
      followedId: followedId,
    });
    return follow;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const unFollow = async (followerId: number, followedId: number) => {
  try {
    const unFollow = await UserFollowLinks.destroy({
      where: {
        followerId: followerId,
        followedId: followedId,
      },
    });
    return unFollow;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const findAllFollowedByUserId = async (userId: number) => {
  try {
    const followed = await UserFollowLinks.findAll({
      where: {
        followerId: userId,
      },
    });
    return followed;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
