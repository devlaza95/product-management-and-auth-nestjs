import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

export const ActiveUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Partial<jwt.JwtPayload> => {
    try {
      const request = ctx.switchToHttp().getRequest();
      const accessToken = request.headers.authorization.split(' ')[1];
      const { email, userId } = jwt.verify(
        accessToken,
        process.env.JWT_SECRET,
      ) as jwt.JwtPayload;
      return {
        email,
        userId,
      };
    } catch (error) {
      throw new ForbiddenException();
    }
  },
);
