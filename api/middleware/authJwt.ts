import {User} from '../models/UserModel.js';
import jwt from 'jsonwebtoken';
import {NextFunction, Request, Response} from 'express';
import * as fs from 'fs';

export const isAuthtenticated = async (req: Request, res: Response, next: NextFunction) => {
  const authHeaderFromCookie = req.cookies['token'];
  const authHeaderFromHeader = req.headers['x-access-token'] || req.body.headers;
  let userAuth: boolean = true;

  try {
    if (!authHeaderFromCookie || !authHeaderFromHeader) {
      userAuth = false;
      return res.status(403).json({
        message: 'No token provided',
      });
    }

    //key from private key
    const privateKey = fs.readFileSync(new URL('../../../config/jwt/mykey.pem', import.meta.url), 'utf8');
    const decoded = jwt.verify(authHeaderFromCookie as string || authHeaderFromHeader as string, privateKey, {
      algorithms: ['RS256'],
    });

    const user = await User.findOne({
      where: {
        // @ts-ignore
        id: decoded.id,
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
    return res.status(500).json({
      message: 'Failed to authenticate token',
      error,
    });
  }
};
