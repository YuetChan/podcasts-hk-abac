import { Injectable, NestMiddleware } from "@nestjs/common";

@Injectable()
export class IpTrackingMiddleware implements NestMiddleware {

  constructor() { }

  use(req: any, res: any, next: () => void) {
    next();
  }
  
}