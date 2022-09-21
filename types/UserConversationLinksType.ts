import { UserConversationLinks } from './../api/models/UserConversationLinksModel';
import { Model } from 'sequelize';


export default interface UserConversationLinksType extends Model<typeof UserConversationLinks> {
  userId?: number,
  conversationId?: number,
}