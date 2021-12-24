import { Controller, Post, Req } from '@nestjs/common';

@Controller('view')
export class ViewController {

  @Post()
  async createView(@Req() req) { 
    return 'hello world'; 
  }

}
