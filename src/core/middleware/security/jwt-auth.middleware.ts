import { HttpStatus, Injectable, InternalServerErrorException, NestMiddleware } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

import axios from "axios";

@Injectable()
export class JwtAuthMiddleware implements NestMiddleware {

	private REST_HOST = '';

	constructor(
		private jwtSvc: JwtService, 
		private configSvc: ConfigService) { 
			this.REST_HOST = this.configSvc.get<string>('REST_HOST');
	}

  async use(req: any, res: any, next: () => void) {
		const jwt = req.headers['authorization']?.replace('Bearer ', '');
		if(jwt) { 
			const { email } = this.jwtSvc.decode(jwt) as User;

			req.user = await axios.get(
				this.REST_HOST + '/users/info', {
					params: {
						email: email
					}
			}).then(res => {
				if(res.status === HttpStatus.OK) {
					return res.data.data.user;
				}
				
				throw new InternalServerErrorException();
			}).catch(err => {
				throw new InternalServerErrorException();
			});
		}else { 
			req.user = null;
		}

		console.log('jwt auth finished', req.user);
    next();
  }

}