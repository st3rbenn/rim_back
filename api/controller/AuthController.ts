import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { User } from '../models/UserModel.js';
import { findUserByEmail, findUserByPseudo } from '../services/UserServices.js';
import * as fs from 'fs';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, pseudo, birthDate } = req.body;

    const sameEmail = await findUserByEmail(email);
    const samePseudo = await findUserByPseudo(pseudo);

    if(Object(sameEmail).length > 0 || Object(samePseudo).length > 0) {

      res.status(409).json({
        message: 'User already exists'
      })

    } else if(!email || !password || !pseudo || !birthDate) {

      res.status(400).json({
        message: `Missing ${!email ? 'email' : ''} ${!password ? 'password' : ''} ${!pseudo ? 'pseudo' : ''} ${!birthDate ? 'birthDate' : ''}`
      })

    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await User.create({
        email,
        password: hashedPassword,
        pseudo,
        birthDate
      });
      //key from private key
      const privateKey = fs.readFileSync(new URL('../../../config/jwt/mykey.pem', import.meta.url), 'utf8');

      const token = jwt.sign({ id: user.get('id'), email: email, }, privateKey, {
        expiresIn: 86400,
        algorithm: 'RS256'
      });
      console.log(token);

      res.cookie('token', token).json({
        message: 'User created',
        user,
        token
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Error creating user',
      error
    })
    throw error;
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);
    

    if(!user) {
      res.status(404).json({
        message: 'User not found'
      })
    } else {
      // @ts-ignore
      const passwordIsValid = await bcrypt.compare(password, user.password);

      if(!passwordIsValid) {
        res.status(401).json({
          message: 'Invalid password'
        })
      } else {
        //key from private key
        const privateKey = fs.readFileSync(new URL('../../../config/jwt/mykey.pem', import.meta.url), 'utf8');
        console.log(privateKey);

        // @ts-ignore
        const token = jwt.sign({ id: user.id, email: user.email, role: user.role}, privateKey, {
          expiresIn: 86400, // 24 hours
          algorithm: 'RS256'
        });
        console.log(token);

        res.cookie('token', token).json({
          message: 'User logged in',
          user,
          token
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      message: 'Error logging in user',
      error
    })
    throw error;
  }
};