import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  findAll() {
    return `Returns all users`;
  }

  findOne(id: number) {
    return `Returns a #${id} user`;
  }

  remove(id: number) {
    return `Removes a #${id} user`;
  }
}
