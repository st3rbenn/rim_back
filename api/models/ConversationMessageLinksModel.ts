import {DataTypes} from 'sequelize';
import sequelize from '../database/Connection.js';

const {INTEGER} = DataTypes;

export const ConversationMessageLinks = sequelize.define(
  'ConversationMessageLinks',
  {
    conversationId: {
      type: INTEGER,
      allowNull: false,
    },
    messageId: {
      type: INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: 'conversation_message_links',
    underscored: true,
    timestamps: false,
  },
);
