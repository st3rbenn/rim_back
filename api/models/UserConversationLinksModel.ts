import { DataTypes } from 'sequelize';
import sequelize from '../database/Connection.js';

const { INTEGER, STRING, DATE, JSON } = DataTypes;

export const UserConversationLinks = sequelize.define('UserConversationLinks', {
  id: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: INTEGER,
    allowNull: false,
  },
  conversationId: {
    type: INTEGER,
    allowNull: false,
  },
  createdAt: {
    type: DATE,
    allowNull: false,
    defaultValue: new Date(),
  },
  updatedAt: {
    type: DATE,
    allowNull: false,
    defaultValue: new Date(),
  },
}, {
  tableName: 'user_conversation_links',
  underscored: true,
});