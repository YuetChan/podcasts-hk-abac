import { 
  Controller, Get, HttpStatus, 
  Param, ParseIntPipe, Patch, Req, Res
 } from '@nestjs/common';
import { handleUnknowError } from 'src/core/utils/api-err.helper';
import { wrapInDataObject } from 'src/core/utils/dto-format.helper';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {

  constructor(
    private usersSvc: UsersService) { }

  @Get(':id')
  async getUserInfo(@Param('id', ParseIntPipe) id) { 
    const data = (await this.usersSvc.getUserById(id, true, false).catch(err => {
      handleUnknowError(err);
    })) as { name, description, subscriptions };

    return wrapInDataObject(data);
  }

  @Patch(':id')
  async updateUserInfo(@Req() req, @Res() res, @Param('id', ParseIntPipe) id) {
    await this.usersSvc.updateUserInfo(req.body.data).catch(err => { 
      handleUnknowError(err); 
    });
    
    res.status(HttpStatus.NO_CONTENT);
  }

}
