import {DataTypes} from 'sequelize';
import sequelize from '../database/Connection.js';

const {INTEGER} = DataTypes;

export const UserFollowLinks = sequelize.define(
  'UserRelationshipLinks',
  {
    followerId: {
      type: INTEGER,
      allowNull: false,
    },
    followedId: {
      type: INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: 'user_relationship_links',
    underscored: true,
  },
);