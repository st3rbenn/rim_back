import {DataTypes} from 'sequelize';
import sequelize from '../database/Connection.js';

const {INTEGER} = DataTypes;

export const UserBlockLinks = sequelize.define(
  'UserBlockLinks',
  {
    blockerId: {
      type: INTEGER,
      allowNull: false,
    },
    blockedId: {
      type: INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: 'user_block_links',
    underscored: true,
  },
);