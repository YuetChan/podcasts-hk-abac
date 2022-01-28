import {  
  Injectable, NestMiddleware,
  HttpStatus,
  ForbiddenException,  InternalServerErrorException, NotFoundException, BadRequestException
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import axios from "axios";
import { UrlHelper } from "src/core/utils/url.helper";

@Injectable()
export class SubscriptionAbacMiddleware implements NestMiddleware {

  private REST_HOST = '';

  constructor(
    private configSvc: ConfigService,
    private urlHelper: UrlHelper) {
    this.REST_HOST = this.configSvc.get<string>('REST_HOST');
  }

  async use(req: any, res: any, next: () => void) {
    const methods = req.route.methods;
    const loginedUser = req.user;
    console.log(req)
    const srcSubscription = req.body.data?.subscription;

    console.log(srcSubscription);

    if(methods.get) { }

    if(methods.post) {
      const userId = srcSubscription.userId;
      const subscriberId = srcSubscription.subscriberId;

      if(!(loginedUser.id === subscriberId 
          || loginedUser.role === 'admin')) {
        throw new ForbiddenException();
      }

      const user = await axios.get(this.REST_HOST + `/users/${userId}/info`).then(res => {
        if(res.status !== HttpStatus.OK) {
          throw new InternalServerErrorException();
        }

        return res.data.data.user
      }).catch(err => {
        if(err.response.status === HttpStatus.NOT_FOUND) {
          throw new BadRequestException();
        }

        throw new InternalServerErrorException();
      });
    }

    if(methods.delete) {
      const id = this.urlHelper.getResourceId(req.url, 'subscriptions');

      const targetSubscription = await axios.get(
        this.REST_HOST + `/subscriptions/${id}`).then(res => {
        if(res.status !== HttpStatus.OK) {
          throw new InternalServerErrorException();
        }

        return res.data.data.subscription;
      }).catch(err => {
        console.log(err.response.status)

        if(err.response.status === HttpStatus.NOT_FOUND) {
          throw new NotFoundException();
        }
        console.log('calleddd')
        throw new InternalServerErrorException();
      });

      if(loginedUser.id !== targetSubscription.subscriberId) {
        throw new ForbiddenException();
      }
    }
    
    next();
  }
  
}