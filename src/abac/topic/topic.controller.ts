import { Controller, Delete, Get, Patch, Post } from '@nestjs/common';

@Controller('topics')
export class TopicController {

  // done
  @Get()
  getTopicsByUserParams() { }

  // done
  @Post()
  createTopic() { }

  //done
  @Patch(':id')
  updateContentInTopic() { }

  @Delete(':id')
  deleteTopic() { }

}
