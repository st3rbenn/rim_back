import { findAllUsers } from './../../controller/UserController';
import path from 'path';
import { NextFunction, Request, Response } from 'express';

export default function fileExtLimiter(allowedExtArray: string[]) {
  try {
    return async (req: Request, res: Response, next: NextFunction) => {
      const files = req.files;
      const fileExtArray: string[] = [];

      // @ts-ignore
      Object.keys(files).forEach((key) => {
        // @ts-ignore
        fileExtArray.push(path.extname(files[key].name));
      });

      const allowed = fileExtArray.every((ext) => allowedExtArray.includes(ext));

      if (!allowed) {
        const properVerb = allowedExtArray.length > 1 ? 'are' : 'is';
        const properNoun = allowedExtArray.length > 1 ? 'extensions' : 'extension';
        const errorMessage = `The file ${properNoun} ${properVerb} the only allowed file ${properNoun}.`;
        return res.status(400).json({ message: errorMessage });
      }

      next();
    };
  } catch (err) {
    console.error(err);
  }
}