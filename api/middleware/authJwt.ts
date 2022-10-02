import {User} from '../models/UserModel.js';
import jwt, { Secret } from 'jsonwebtoken';
import {NextFunction, Request, Response} from 'express';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

dotenv.config();

export const isAuthtenticated = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Authorization: 'Bearer TOKEN'
  let userAuth: boolean = true;

  try {

    if (!token) {
      userAuth = false;
      return res.status(403).json({
        message: 'No token provided',
      });
    }

    if (!token) {
      throw new Error('Authentication failed!');
    }

    //key from private key
    const publicKey = fs.readFileSync(new URL('../../../config/jwt/pubkey.pem', import.meta.url), 'utf8');

    const verified = jwt.verify(token, publicKey);

    const user = await User.findOne({
      where: {
        // @ts-ignore
        id: verified.id,
      },
    });

    if (!user) {
      userAuth = false;
      return res.status(404).json({
        message: 'No user found',
      });
    }

    if(userAuth) {
      next();
    }

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Failed to authenticate token',
      error,
    });
  }
};
