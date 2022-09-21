import { DataTypes } from 'sequelize';
import sequelize from '../database/Connection.js';

const { INTEGER } = DataTypes;

export const UserConversationLinks = sequelize.define('UserConversationLinks', {
  userId: {
    type: INTEGER,
    allowNull: false,
  },
  conversationId: {
    type: INTEGER,
    allowNull: false,
  }
}, {
  tableName: 'user_conversation_links',
  underscored: true,
  timestamps: false,
});