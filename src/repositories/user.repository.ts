import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {LocalDataSource} from '../datasources';
import {User, UserRelations} from '../models';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.username,
  UserRelations
> {
  constructor(
    @inject('datasources.local') dataSource: LocalDataSource,
  ) {
    super(User, dataSource);
  }
}
