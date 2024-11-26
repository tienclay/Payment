import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as dotenv from 'dotenv';
dotenv.config({
  path: '.env',
});

@Injectable()
export class ApiKeyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const apiKey = req.headers['x-api-key'];
    if (apiKey !== process.env.X_API_KEY) {
      throw new HttpException(
        {
          error: -1,
          message: 'fail',
          data: null,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    next();
  }
}
