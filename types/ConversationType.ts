import { Model } from 'sequelize';
import { Conversation } from '../api/models/ConversationModel';


export default interface ConversationType extends Model<typeof Conversation> {
  id?: number,
  createdAt?: Date,
  updatedAt?: Date
}