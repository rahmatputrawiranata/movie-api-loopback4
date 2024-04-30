import {Entity, model, property} from '@loopback/repository';

@model()
export class User extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
  })
  username: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;


  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export interface UserCredentials {
  username: string;
  password: string;
}

export type UserWithRelations = User & UserRelations;
