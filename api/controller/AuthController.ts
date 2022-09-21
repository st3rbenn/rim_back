import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserType from '../../types/UserType';
import { Request, Response } from 'express';
import { User } from '../models/UserModel.js';
import * as fs from 'fs';

export const register = async (req: Request, res: Response) => {
  let canUserBeCreated = true;
  try {
    const reqBody = {
      email: req.body.email,
      password: req.body.password,
      pseudo: req.body.pseudo,
      birthDate: req.body.birthDate
    };

    for(const [key, value] of Object.entries(reqBody)) {
      console.log(value);
      if(!value) {
        canUserBeCreated = false;
        return res.status(400).json({
          message: `The ${key} is required`
        })
      }
    }

    const sameEmail: UserType | null = await User.findOne({
      where: {
        email: reqBody.email
      }
    });

    const samePseudo: UserType | null = await User.findOne({
      where: {
        pseudo: reqBody.pseudo
      }
    });

    if(sameEmail) {
      res.status(409).json({
        message: 'User with this email already exists'
      })
      canUserBeCreated = false;
    } 
    
    if(samePseudo) {
      res.status(409).json({
        message: 'User with this pseudo already exists'
      })
      canUserBeCreated = false;
    } 
    
    if(canUserBeCreated) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(reqBody.password, salt);

      const user: UserType | null = await User.create({
        email: reqBody.email.toLowerCase(),
        password: hashedPassword,
        pseudo: reqBody.pseudo,
        birthDate: reqBody.birthDate
      });
      //key from private key
      const privateKey = fs.readFileSync(new URL('../../../config/jwt/mykey.pem', import.meta.url), 'utf8');

      const token = jwt.sign({ id: user.get('id'), email: reqBody.email, }, privateKey, {
        expiresIn: 86400,
        algorithm: 'RS256'
      });

      res.cookie('token', token).json({
        message: 'User created',
        email: user.get('email'),
        pseudo: user.get('pseudo')
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
  let userCanBeLogged = true;
  try {
    const reqBody = {
      email: req.body.email,
      password: req.body.password
    };

    for(const [key, value] of Object.entries(reqBody)) {
      if(!value) {
        userCanBeLogged = false;
        return res.status(400).json({
          message: `The ${key} is required`
        })
      }
    }

    //key from private key
    const privateKey = fs.readFileSync(new URL('../../../config/jwt/mykey.pem', import.meta.url), 'utf8');

    const user = await User.findOne({
      where: {
        email: reqBody.email.toLowerCase()
      }
    });
    // @ts-ignore
    const passwordIsValid = bcrypt.compare(reqBody.password, user.password as string);
    

    if(!user) {
      res.status(404).json({
        message: 'User not found'
      })
      userCanBeLogged = false;
    } 

    if(!passwordIsValid) {
      res.status(401).json({
        message: 'Invalid password'
      })
      userCanBeLogged = false;
    } 

    if(userCanBeLogged) {
      console.log(passwordIsValid)
      // @ts-ignore
      const token = jwt.sign({ id: user?.id, email: user?.email, role: user?.role}, privateKey, {
        expiresIn: 86400, // 24 hours
        algorithm: 'RS256'
      });
  
      res.cookie('token', token).json({
        message: 'User logged in',
        email: user?.get('email'),
        pseudo: user?.get('pseudo'),
        token
      });
    }

  } catch (error) {
    res.status(500).json({
      message: 'Error logging in user',
      error
    })
    throw error;
  }
};