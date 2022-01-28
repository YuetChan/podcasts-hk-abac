import { Controller, Get } from '@nestjs/common';

@Controller('users')
export class UserController {

  @Get('/role')
  getUserRoleById() {
    return "testing";
  }

}
