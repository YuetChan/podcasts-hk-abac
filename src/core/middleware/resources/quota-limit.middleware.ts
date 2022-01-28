import { HttpStatus, Injectable, InternalServerErrorException, NestMiddleware, UnprocessableEntityException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import axios from "axios";
import * as moment from "moment";

@Injectable()
export class QuotaLimitMiddleware implements NestMiddleware {

	constructor(private configSvc: ConfigService) { }

  async use(req: any, res: any, next: () => void) {
		const user = req.data.user;

		if(user.role !== 'admin') {
			const uploadQuota = user.uploadQuota;
			const uploadedAt = moment.unix(uploadQuota.uploadedAt).tz('America/New_York');
			
			const today = moment().tz('America/New_York').startOf('day');
			const now = moment().tz('America/New_York').unix();
			
			if(today.isAfter(uploadedAt)) { 
				uploadQuota.count = 5; 
				uploadQuota.uploadedAt = now;
			}else {
				if(uploadQuota.count < 1) {
					throw new UnprocessableEntityException();
				}else {
					uploadQuota.count --;
					uploadQuota.uploadedAt = now;
				}
			}
	
			const res = await axios.patch(
				this.configSvc.get<string>('REST_HOST') + `/users/${user.id}/uploadQuota`);
				
			if(res.status !== HttpStatus.NO_CONTENT) {
				throw new InternalServerErrorException();
			}
		}

		console.debug('quota limit finished', user);
    next();
  }

}