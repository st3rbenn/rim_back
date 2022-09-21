import { DataTypes } from 'sequelize';
import sequelize from '../database/Connection.js';

const { INTEGER } = DataTypes;

export const UserPostLinks = sequelize.define('UserPostLinks', {
  userId: {
    type: INTEGER,
    allowNull: false,
  },
  postId: {
    type: INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'user_post_links',
  underscored: true,
  timestamps: false,
});