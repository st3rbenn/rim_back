import sequelize from '../database/Connection.js';

export const findAllConversationByUserId = async (userId: number) => {
  try {
    const getConversations = await sequelize.models.UserConversationLinks.findAll({
      where: {
        userId: userId,
      },
      include: [
        {
          model: sequelize.models.User,
          attributes: ['id', 'firstName', 'lastName', 'email'],
          where: {
            id: userId,
          },
        },
      ],
    });
    return getConversations;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
