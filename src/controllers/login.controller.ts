// Uncomment these imports to begin using these cool features!

import {inject} from '@loopback/core';
import {HttpErrors, ResponseObject, get, getModelSchemaRef, post, requestBody, response} from '@loopback/rest';
import {compare} from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import {LoginRequest} from '../models';
import {UserService} from '../services';
const USER_CREDENTIALS = {
  username: 'myrepublic',
  password: '$2a$10$eynddp84t3XL/XeO/VfHz.QM0Z8PnONbfZ//yftseBYrUg3umJnY2'
}

const LOGIN_RESPONSE: ResponseObject = {
  description: 'Login Response',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          response: {
            type: 'object',
            properties: {
              token: {type: 'string'}
            }
          }
        }
      }
    }
  }
}

export class LoginController {
  constructor(
    @inject(UserService.name)
    public userService: UserService,
    @inject('authentication.jwt.secret')
    private jwtSecret: string
  ) { }

  @post('/login')
  @response(200, LOGIN_RESPONSE)
  async login(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(LoginRequest, {
            title: LoginRequest.name
          })
        }
      }
    })
    loginRequest: LoginRequest
  ): Promise<object> {

    try {

      const user = await this.userService.findUserByUsername(loginRequest.username)
      if (!user) {
        throw new HttpErrors.Unauthorized('Invalid Username')
      }

      const passwordMatched = await compare(loginRequest.password, user.password)
      if (!passwordMatched) {
        throw new HttpErrors.Unauthorized('Invalid Password')
      }

      const token = jwt.sign({
        username: loginRequest.username
      }, this.jwtSecret, {
        expiresIn: '1h'
      })

      return {
        response: {
          token: token
        }
      }
    } catch (error) {
      if (error instanceof HttpErrors.HttpError) {
        throw error
      } else {
        console.log(error, '@loginError')
        throw new HttpErrors.InternalServerError('An error occurred')
      }

    }
  }

  @get('/users')
  @response(200, {
    users: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          username: {type: 'string'}
        }
      },
    }
  })
  async getUsers() {

    const users = await this.userService.getAllUsers()

    return users.map(user => {
      return {
        username: user.username
      }
    })

  }
}
