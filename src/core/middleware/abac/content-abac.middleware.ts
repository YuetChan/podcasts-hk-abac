import { 
  Injectable, NestMiddleware, 
  HttpStatus,
  ForbiddenException, InternalServerErrorException, NotFoundException
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { UrlHelper } from "src/core/utils/url.helper";

import axios from "axios";

@Injectable()
export class ContentAbacMiddleware implements NestMiddleware {

  private REST_HOST = '';

  constructor(
    private configSvc: ConfigService,
    private urlHelper: UrlHelper) {
      this.REST_HOST = this.configSvc.get<string>('REST_HOST');
    }

  async use(req: any, res: any, next: () => void) {
    const methods = req.route.methods;
    const loginedUser = req.user;
    const srcContent = req.body.data?.content;

    console.log('called')
    if(methods.post) {
      if(!(loginedUser.id === srcContent.info.userId 
          || loginedUser.role === 'admin')) { 
          throw new ForbiddenException()
      }
    }

    if(methods.patch || methods.delete) {
      const id = this.urlHelper.getResourceId(req.url, 'contents');

      // info contain userId
      if(srcContent?.info) {
        if(loginedUser.role === 'admin') {
          throw new ForbiddenException();
        }
      }

      const targetContent = id
        ? await axios.get(
          this.REST_HOST + `/contents/${id}`).then(res => {
            console.log(res)
            if(res.status !== HttpStatus.OK) {
              throw new InternalServerErrorException();
            }

            return res.data.date.content;
          }).catch(err => {
            if(err.response.status === HttpStatus.NOT_FOUND) {
              throw new NotFoundException();
            }

            throw new InternalServerErrorException();
          })
        : null;

      if(!(loginedUser.id === targetContent.info.userId 
          || loginedUser.role === 'admin')) {
        throw new ForbiddenException();
      }
    }

    console.log('contents abac finished', loginedUser)
    next();
  }

}

