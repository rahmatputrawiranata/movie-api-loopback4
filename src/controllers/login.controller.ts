// Uncomment these imports to begin using these cool features!

import {inject} from '@loopback/core';
import {HttpErrors, Request, ResponseObject, RestBindings, getModelSchemaRef, post, requestBody, response} from '@loopback/rest';
import {LoginRequest} from '../models';

// import {inject} from '@loopback/core';


const USER_CREDENTIALS = {
  username: 'myrepublic',
  password: '123abc123'
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
  constructor(@inject(RestBindings.Http.REQUEST) private req: Request) { }

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
      // Check if the username and password are correct
      if (loginRequest.username !== USER_CREDENTIALS.username) {
        throw new HttpErrors.Unauthorized('Invalid username')
      }
      if (loginRequest.password !== USER_CREDENTIALS.password) {
        throw new HttpErrors.Unauthorized('Invalid password')
      }

      return {
        response: {
          token: 'token'
        }
      }
    } catch (error) {
      if (error instanceof HttpErrors.HttpError) {
        throw error
      } else {
        throw new HttpErrors.InternalServerError('An error occurred')
      }

    }
  }
}
