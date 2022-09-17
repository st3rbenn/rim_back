import sequelize from "../../database/Connection.js";

export const createRelationsBetweenUserAndPost = async (userId: number, postId: number) => {
  try {
    const res = await sequelize.models.UserPostLinks.create({
      userId,
      postId
    });
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};