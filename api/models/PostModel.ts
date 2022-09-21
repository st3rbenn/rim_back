import { DataTypes } from 'sequelize';
import sequelize from '../database/Connection.js';

const { INTEGER, TEXT } = DataTypes;

export const Post = sequelize.define('Post', {
  id: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  content: {
    type: TEXT,
    allowNull: false
  },
}, {
  tableName: 'post',
  underscored: true,
});