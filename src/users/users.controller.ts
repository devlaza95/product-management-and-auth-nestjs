import { Controller, Get, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@ApiBearerAuth('accessToken')
@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
