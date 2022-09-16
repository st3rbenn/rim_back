import { GetUserReq } from './../../models/schema';
import { Request, RequestHandler, Response } from 'express';
import { User } from '../../models/schema';
import { execute } from '../../config/database/Connection.js';
import * as UserServices from '../../api/services/UserServices.js'

export const getUsers: RequestHandler = async (req: Request, res: Response) => {
  try {
    const Users: User = await UserServices.getUsers();

    res.status(200).json({
      Users
    })
  } catch (error) {
    console.error('[User.controller][getUsers][error]', typeof error === 'object' ? JSON.stringify(error) : error);
    
    res.status(500).json({
      message: 'Une erreur est survenue lors de l\'obtention des données'
    })
  }
}
// @ts-ignore
export const getUserById: RequestHandler = async (req: GetUserReq, res: Response) => {
  try {
    const { id } = req.params;
    const User: User = await UserServices.getUserById(id.toString());

    res.status(200).json({
      User
    })
  } catch (error) {
    console.error('[User.controller][getUserById][error]', typeof error === 'object' ? JSON.stringify(error) : error);
    
    res.status(500).json({
      message: 'Une erreur est survenue lors de l\'obtention des données'
    })
  }
}