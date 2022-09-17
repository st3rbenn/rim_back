import { DataTypes } from 'sequelize';
import sequelize from '../database/Connection.js';

const { INTEGER, DATE } = DataTypes;

export const ConversationMessageLinks = sequelize.define('ConversationMessageLinks', {
  id: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  conversationId: {
    type: INTEGER,
    allowNull: false,
  },
  userId: {
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
  tableName: 'conversation_message_links',
  underscored: true,
});