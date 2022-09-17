import sequelize from "../database/Connection.js";

export const findUserByEmail = async (email: string) => {
  try {
    const user = await sequelize.models.User.findAll({
      where: {
        email
      }
    });
    return user;
  } catch (error) {
    return error;
  }
}

export const findUserById = async (id: number) => {
  try {
    const user = await sequelize.models.User.findByPk(id);
    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
