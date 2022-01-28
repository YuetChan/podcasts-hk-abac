import { Controller, Delete, Get, Patch, Post } from '@nestjs/common';

@Controller('contents')
export class ContentController {

  // done
  @Get(':id')
  getContentById() { }

  // done
  @Post()
  createContent() { }

  // done
  @Patch(':id/info')
  updateInfoDetail() { }

  // done
  @Patch(':id/media')
  updateMediaDetail() { }

  // done
  @Delete(':id')
  deleteContentById() { }

}
