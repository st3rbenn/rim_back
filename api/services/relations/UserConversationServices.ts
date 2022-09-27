import sequelize from '../../database/Connection.js';

export const createRelationBetweenUsersAndConversation = async (users: string[], conversationId: number) => {
  try {
    let conv: any = [];
    for (const user of users) {
      const res = await sequelize.models.UserConversationLinks.create({
        userId: user,
        conversationId,
      });
      conv.push(res);
    }
    return conv;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getConversationBetweenUsers = async (conversationId: number) => {
  try {
    const conversation = await sequelize.models.UserConversationLinks.findByPk(conversationId);
    return conversation;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
