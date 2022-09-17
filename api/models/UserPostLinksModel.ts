import { DataTypes } from 'sequelize';
import sequelize from '../database/Connection.js';

const { INTEGER, STRING, DATE, JSON } = DataTypes;

export const UserPostLinks = sequelize.define('UserPostLinks', {
  id: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: INTEGER,
    allowNull: false,
  },
  postId: {
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
  tableName: 'user_post_links',
  underscored: true,
});