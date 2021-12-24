import { Injectable } from "@nestjs/common";
import { User, UsersService } from "src/users/users.service";

@Injectable()
export class RegisterService {

  constructor(private userSvc: UsersService) { }

  async register(user: User) {
		const registeredUser = await this.userSvc.getUserByEmail(user.email, false, false);
		if(!registeredUser) {  
			return this.userSvc.createUser({
				... user,
				uploadQuota: { count: 5 }
			}); 
		}

		return registeredUser;
  }

	async isEmailRegistered(email) { return !await this.userSvc.getUserByEmail(email, false, false); }

}
