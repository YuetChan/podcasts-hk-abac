import { ForbiddenException, Injectable, NestMiddleware } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class UserAbacMiddleware implements NestMiddleware {

  private REST_HOST = '';

  constructor(private configSvc: ConfigService) {
    this.REST_HOST = this.configSvc.get<string>('REST_HOST');
  }

  async use(req: any, res: any, next: () => void) {
    const methods = req.route.methods;
    const loginedUser = req.user;

    if(methods.get) {
      if((req.url as string).includes('/role')) {
        if(!(loginedUser?.role === 'admin')) {
          throw new ForbiddenException();
        }
      }
    }

    console.log('contents abac finished', loginedUser)
    next();
  }

  
}