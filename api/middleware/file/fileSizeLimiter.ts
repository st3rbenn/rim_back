import { NextFunction, Response, Request } from 'express';
const MB = 5; // 5 MB
const FILE_SIZE_LIMIT = MB * 1024 * 1024;

export default async function fileSizeLimiter(req: Request, res: Response, next: NextFunction) {
  try {
    const files = req.files;
    const fileSizeArray: number[] = [];

    // @ts-ignore
    Object.keys(files).forEach((key) => {
      // @ts-ignore
      fileSizeArray.push(files[key].size);
    });

    const allowed = fileSizeArray.every((size) => size < FILE_SIZE_LIMIT);

    if (!allowed) {
      const properVerb = MB > 1 ? 'are' : 'is';
      const properNoun = MB > 1 ? 'MB' : 'MB';
      const errorMessage = `The file size ${properNoun} ${properVerb} the only allowed file size.`;
      return res.status(400).json({ message: errorMessage });
    }

    next();
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};