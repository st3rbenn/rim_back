import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import {fileURLToPath} from 'url';
import * as dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);


const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + '../../../../assets/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname.split(' ').join('-').split('.')[0] + '-' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

export default async function UploadProvider(req: Request, res: Response) {
  try {
    upload.single('file')(req, res, (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          message: 'Error uploading file',
        });
      }
      return res.status(200).json({
        message: 'File is uploaded',
        file: process.env.UPLOAD_URL_PROVIDER as string + req.file?.filename,
      });
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Error uploading file',
    });
  }
}