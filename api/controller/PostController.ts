import { Request, RequestHandler, Response } from 'express';
import { Post } from '../../models/schema';
import db, { execute } from '../../config/database/Connection.js'

export const getPost: RequestHandler = (req: Request, res: Response) => {
  
}