import { Sequelize } from 'sequelize';
import sequelize from './database/Connection.js';
import * as dotenv from 'dotenv';
import { User } from './models/UserModel.js';
import { Conversation } from './models/ConversationModel.js';
import { Post } from './models/PostModel.js';
import { Message } from './models/MessageModel.js';
import { UserConversationLinks } from './models/UserConversationLinksModel.js';
import { UserPostLinks } from './models/UserPostLinksModel.js';
import { ConversationMessageLinks } from './models/ConversationMessageLinksModel.js';

dotenv.config();

export default async function db() {
  try {
    console.log('🛫 [sequelize]: Connecting to database...');

    await sequelize.authenticate();
    console.log(`🛫 [sequelize]: ✅ Connection with database ✨ ${process.env.DB_NAME} ✨ has been established successfully.`);

    const models = [User, UserConversationLinks, Conversation, UserPostLinks, Post , ConversationMessageLinks, Message];

    for (const model of models) {
      await model.sync({ alter: false });
      console.log(`🛫 [sequelize]: ✅ Model ${model.name} synced successfully.`);
    }

    User.hasMany(UserConversationLinks, { foreignKey: 'userId' });
    User.hasMany(Message, { foreignKey: 'userId' });
    UserConversationLinks.belongsTo(User, { foreignKey: 'userId' });

    Conversation.hasMany(UserConversationLinks, { foreignKey: 'conversationId' });
    UserConversationLinks.belongsTo(Conversation, { foreignKey: 'conversationId' });

    User.hasMany(UserPostLinks, { foreignKey: 'userId' });
    UserPostLinks.belongsTo(User, { foreignKey: 'userId' });

    Post.hasMany(UserPostLinks, { foreignKey: 'postId' });
    UserPostLinks.belongsTo(Post, { foreignKey: 'postId' });

    Conversation.hasMany(ConversationMessageLinks, { foreignKey: 'conversationId' });
    ConversationMessageLinks.belongsTo(Conversation, { foreignKey: 'conversationId' });

    Message.hasMany(ConversationMessageLinks, { foreignKey: 'messageId' });
    ConversationMessageLinks.belongsTo(Message, { foreignKey: 'messageId' });

    await sequelize.sync({ alter: false });

    console.log('🛫 [sequelize]: 🤌 All models synced successfully.');

  } catch (error) {
    console.error('🛫 [sequelize]: ❌ Unable to connect to the database:', error);
    throw error;
  }
};