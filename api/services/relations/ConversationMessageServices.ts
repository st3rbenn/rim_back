import sequelize from '../../database/Connection.js';

export const createRelationBetweenConversationAndMessage = async (conversationId: number, messageId: number) => {
  try {
    const res = await sequelize.models.ConversationMessageLinks.create({
      conversationId,
      messageId,
    });
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
