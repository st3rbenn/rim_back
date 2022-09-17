import { DataTypes } from 'sequelize';
import sequelize from '../database/Connection.js';

const { INTEGER, TEXT, DATE } = DataTypes;

export const Post = sequelize.define('Post', {
  id: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  message: {
    type: TEXT,
    allowNull: false
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
  tableName: 'post',
  underscored: true,
});