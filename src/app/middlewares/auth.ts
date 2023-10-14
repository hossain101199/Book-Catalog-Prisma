import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import config from '../../config';
import ApiError from '../../errors/ApiError';

const auth =
  (...requiredRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const token = req.headers.authorization;

      if (token) {
        const verifiedToken = jwt.verify(
          token,
          config.jwt.secret as Secret
        ) as JwtPayload;
        if (
          requiredRoles.length &&
          requiredRoles.includes(verifiedToken.role)
        ) {
          req.verifiedUser = verifiedToken;

          next();
        } else {
          throw new ApiError(403, 'Forbidden');
        }
      } else {
        throw new ApiError(401, 'You are not authorized');
      }
    } catch (error) {
      next(error);
    }
  };
export default auth;
