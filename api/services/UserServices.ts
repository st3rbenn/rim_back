import { Request, RequestHandler, Response } from 'express';
import { User } from '../../models/schema';
import { execute } from '../../config/database/Connection.js';
import { UserQueries } from '../queries/UserQueries.js';

export const getUsers = async () => {
  return execute<User>(UserQueries.GetUsers, []);
}

export const getUserById = async (id: string) => {
  return execute<User>(UserQueries.GetUserById, [id]);
}