import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserType from '../../types/UserType';
import {Request, Response} from 'express';
import {User} from '../models/UserModel.js';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

dotenv.config();

export const register = async (req: Request, res: Response) => {
  let canUserBeCreated = true;
  try {
    const reqBody = {
      email: req.body.email,
      password: req.body.password,
      pseudo: req.body.pseudo,
      name: req.body.name,
      birthDate: req.body.birthDate,
    };

    for (const [key, value] of Object.entries(reqBody)) {
      if (!value) {
        canUserBeCreated = false;
        return res.status(400).json({
          message: `The ${key} is required`,
        });
      }
    }

    const sameEmail: UserType | null = await User.findOne({
      where: {
        email: reqBody.email,
      },
    });

    const samePseudo: UserType | null = await User.findOne({
      where: {
        pseudo: reqBody.pseudo,
      },
    });

    if (sameEmail) {
      canUserBeCreated = false;
      return res.status(409).json({
        message: 'User with this email already exists',
      });
    }

    if (samePseudo) {
      canUserBeCreated = false;
      return res.status(409).json({
        message: 'User with this pseudo already exists',
      });
    }

    if (canUserBeCreated) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(reqBody.password, salt);

      const user: UserType | null = await User.create({
        email: reqBody.email.toLowerCase(),
        password: hashedPassword,
        pseudo: reqBody.pseudo,
        birthDate: reqBody.birthDate,
        name: reqBody.name,
      });

      return res.status(200).json({
        message: 'User created',
        email: user.get('email'),
        pseudo: user.get('pseudo'),
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: 'Error creating user',
      error,
    });
    throw error;
  }
};

export const login = async (req: Request, res: Response) => {
  let userCanBeLogged = true;
  try {
    const reqBody = {
      email: req.body.email,
      password: req.body.password,
    };

    for (const [key, value] of Object.entries(reqBody)) {
      if (!value) {
        userCanBeLogged = false;
        return res.status(400).json({
          message: `The ${key} is required`,
        });
      }
    }

    const user = await User.findOne({
      where: {
        email: reqBody.email.toLowerCase(),
      },
    });

    if (!user) {
      userCanBeLogged = false;
      return res.status(404).json({
        message: 'User not found',
      });
    }
    // @ts-ignore
    const passwordIsValid = await bcrypt.compare(reqBody.password, user.password as string);

    if (!passwordIsValid) {
      userCanBeLogged = false;
      return res.status(401).json({
        message: 'Invalid password',
      });
    }

    if (userCanBeLogged) {
      //key from private key
      const privateKey = fs.readFileSync(new URL('../../../config/jwt/mykey.pem', import.meta.url), 'utf8');

      const token = jwt.sign(
        // @ts-ignore
        {id: user?.id, email: user?.email, role: user?.role},
        privateKey,
        {
          algorithm: 'RS256',
          expiresIn: 86400, // 24 hours
        },
      );

      return res
        .status(200)
        .cookie('token', token)
        .json({
          message: 'User logged in',
          email: user?.get('email'),
          pseudo: user?.get('pseudo'),
          token,
        });
    }
  } catch (error) {
    console.log('log in : ', error);
    return res.status(500).json({
      message: 'Error logging in user',
      error,
    });
  }
};
