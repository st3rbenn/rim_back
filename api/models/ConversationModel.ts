import { DataTypes } from 'sequelize';
import sequelize from '../database/Connection.js';

const { INTEGER, DATE, TEXT } = DataTypes;

export const Conversation = sequelize.define('Conversation', {
  id: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  createdAt: {
    type: DATE,
    defaultValue: new Date()
  },
  updatedAt: {
    type: DATE,
    defaultValue: new Date()
  }
}, {
  tableName: 'conversation',
  underscored: true
})