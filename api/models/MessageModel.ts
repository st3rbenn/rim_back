import { DataTypes } from 'sequelize';
import sequelize from '../database/Connection.js';

const { INTEGER, TEXT, DATE } = DataTypes;

export const Message = sequelize.define('Message', {
  id: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  message: {
    type: TEXT,
    allowNull: false
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
  tableName: 'message',
  underscored: true,
});