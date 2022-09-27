import {DataTypes} from 'sequelize';
import sequelize from '../database/Connection.js';

const {INTEGER, DATE, TEXT} = DataTypes;

export const Conversation = sequelize.define(
  'Conversation',
  {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
  },
  {
    tableName: 'conversation',
    underscored: true,
  },
);
