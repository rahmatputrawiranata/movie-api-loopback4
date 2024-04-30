import {Provider, inject} from '@loopback/core';
import {HttpErrors, Middleware} from '@loopback/rest';
import * as jwt from 'jsonwebtoken';
import {UserService} from '../services';
export class JWTMiddleware implements Provider<Middleware> {
  constructor(
    @inject('authentication.jwt.secret')
    private jwtSecret: string,
    @inject(UserService.name)
    private userService: UserService
  ) { }

  async value() {
    const middleware: Middleware = async (ctx, next) => {
      try {
        if (ctx.request.url === '/login') {
          return next();
        }
        const request = ctx.request;

        const token = request.headers.authorization?.replace('Bearer ', '');

        if (!token) {
          throw new HttpErrors.Unauthorized('Authorization header not found');
        }

        const decoded = jwt.verify(token, this.jwtSecret);
        if (!decoded) {
          throw new HttpErrors.Unauthorized('Invalid Token');
        }
        const userDecoded = decoded as {username: string};

        const validateUser = await this.userService.findUserByUsername(userDecoded.username);
        if (!validateUser) {
          throw new HttpErrors.Unauthorized('Invalid Token');
        }
        const result = await next();
        return result;
      } catch (err) {
        if (err instanceof HttpErrors.HttpError) {
          throw err;
        } else {
          console.log(err, '@middlewareError')
          throw new HttpErrors.InternalServerError('An error occurred');
        }
      }
    }
    return middleware
  }
}
