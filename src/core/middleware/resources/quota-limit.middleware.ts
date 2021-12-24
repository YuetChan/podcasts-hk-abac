import { Injectable, NestMiddleware, UnprocessableEntityException } from "@nestjs/common";
import * as moment from "moment";
import { UsersService } from "src/users/users.service";

@Injectable()
export class QuotaLimitMiddleware implements NestMiddleware {

	constructor(private usersSvc: UsersService) { }

  async use(req: any, res: any, next: () => void) {
		const user = req.user;
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
	
			req.user = await this.usersSvc.updateUserUploadQuota(user); 
		}

		console.debug('quota limit finished', user);
    next();
  }

}