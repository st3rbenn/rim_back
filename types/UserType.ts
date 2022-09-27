import { Model } from 'sequelize';
import { User } from '../api/models/UserModel';


export default interface UserType extends Model<typeof User> {
  id?: number,
  email?: string,
  password?: string,
  firstName?: string,
  pseudo?: string,
  avatar?: string,
  biography?: string,
  birthDate?: Date,
  role?: JSON,
  createdAt?: Date,
  updatedAt?: Date
}