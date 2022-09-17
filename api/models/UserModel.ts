import { DataTypes } from 'sequelize';
import sequelize from '../database/Connection.js';

const { INTEGER, STRING, DATE, JSON } = DataTypes;

export const User = sequelize.define('User', {
  id: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: STRING(50),
    allowNull: false,
    unique: true,
  },
  password: {
    type: STRING(255),
    allowNull: false,
  },
  firstName: {
    type: STRING(50),
    allowNull: false,
  },
  lastName: {
    type: STRING(50),
    allowNull: false,
  },
  birthDate: {
    type: DATE,
    allowNull: false,
  },
  role: {
    type: JSON,
    allowNull: false,
    defaultValue: ["ROLE_USER"]
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
  tableName: 'user',
  underscored: true,
});