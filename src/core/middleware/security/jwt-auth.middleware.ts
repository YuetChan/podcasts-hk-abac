import { Injectable, NestMiddleware } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User, UsersService } from "src/users/users.service";

@Injectable()
export class JwtAuthMiddleware implements NestMiddleware {

	constructor(
		private jwtSvc: JwtService,
		private usersSvc: UsersService) { }

  async use(req: any, res: any, next: () => void) {
		const jwt = req.headers['authorization']?.replace('Bearer ', '');
		if(jwt) { 
			const { email } = this.jwtSvc.decode(jwt) as User;
			req.user = await this.usersSvc.getUserByEmail(email, false, true);
		}else { 
			req.user = null; 
		}

		console.log('jwt auth finished', req.user);
    next();
  }

}