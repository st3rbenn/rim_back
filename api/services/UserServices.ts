import sequelize from "../database/Connection.js";
import { createRelationBetweenConversationAndMessage } from "./relations/ConversationMessageServices.js";

export const sendMessage = async (conversationId: number, userId: number, messageSend: string) => {
  try {
    const message = await sequelize.models.Message.create({
      message: messageSend,
      userId: userId
    });

    await createRelationBetweenConversationAndMessage(conversationId, Object(message).dataValues.id);
    return message;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const editMessage = async (messageId: number, message: string) => {
  try {
    const messageEdited = await sequelize.models.Message.update({
      message: message
    }, {
      where: {
        id: messageId
      }
    });
    return messageEdited;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const deleteMessage = async (messageId: number) => {
  try {
    const messageDeleted = await sequelize.models.Message.destroy({
      where: {
        id: messageId
      }
    });
    return messageDeleted;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
