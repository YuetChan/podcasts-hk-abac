import { 
  Injectable, NestMiddleware, 
  HttpStatus, 
  ForbiddenException, InternalServerErrorException,  NotFoundException, BadRequestException 
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import axios from "axios";

import { UrlHelper } from "src/core/utils/url.helper";

@Injectable()
export class TopicAbacMiddleware implements NestMiddleware {

  private REST_HOST = '';

  constructor(
    private configSvc: ConfigService,
    private urlHelper: UrlHelper) { 
      this.REST_HOST = this.configSvc.get<string>('REST_HOST');
  }

  async use(req: any, res: any, next: () => void) {
    const methods = req.route.methods;
    const loginedUser = req.user;

    if(methods.get) { }

    if(methods.post) {
      const srcTopic = req.body.data?.topic;

      if(!(loginedUser.id === srcTopic.userId 
          || loginedUser.role === 'admin')) {
        throw new ForbiddenException();
      }
    }

    if(methods.patch) {
      const srcContentId = req.body.data.contentId;
      const srcContent = await axios.get(
        this.REST_HOST + `/contents/${srcContentId}`).then(res => {
          if(res.status !== HttpStatus.OK) {
            throw new InternalServerErrorException();
          }

          return res.data.data.content;
        }).catch(err => {
          if(err.response.status === HttpStatus.NOT_FOUND) {
            throw new BadRequestException()
          }

          throw new InternalServerErrorException();
        })

      const id = this.urlHelper.getResourceId(req.url, 'topics');

      const targetTopic = await axios.get(
        this.REST_HOST + `/topics/${id}`).then(res => {
          if(res.status !== HttpStatus.OK) {
            throw new InternalServerErrorException();
          }

          return res.data.data.topic;
      }).catch(err => {
        if(err.response.status === HttpStatus.NOT_FOUND) {
          throw new NotFoundException();
        }

        throw new InternalServerErrorException();
      })

      if(!(loginedUser.id === srcContent.info.userId 
        || loginedUser.role === 'admin') 
          || !(loginedUser.id === targetTopic.userId 
            || loginedUser.role === 'admin')) {
        throw new ForbiddenException();
      }
    }

    if(methods.delete) {
      const id = this.urlHelper.getResourceId(req.url, 'topics');

      const targetTopic = await axios.get(
        this.REST_HOST + `/topics/${id}`).then(res => {
          if(res.status !== HttpStatus.OK) {
            throw new InternalServerErrorException();
          }

          return res.data.data.topic;
      }).catch(err => {
        console.log(err);
        if(err.response.status === HttpStatus.NOT_FOUND) {
          throw new NotFoundException();
        }

        throw new InternalServerErrorException();
      });

      if(!(loginedUser.id === targetTopic.userId 
        || loginedUser.role === 'admin')) {
        throw new ForbiddenException();
      }
    }

    next();
  }
  
}