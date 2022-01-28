import { HttpStatus, Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import axios from 'axios';

import * as moment from "moment";

@Injectable()
export class RegisterService {

	private REST_HOST = '';

  constructor(private configSvc: ConfigService) {
		this.REST_HOST = this.configSvc.get<string>('REST_HOST');
	}

  async register(user: User): Promise<User> {
		return await axios.get(
			this.REST_HOST + '/users/info', { 
				params: { 
					email: user.email 
				} 
		}).then(async res => {
			const user = res.data.data.user;

			const role = await axios.get(
				this.REST_HOST + '/users/role', { 
					params: { 
						email: user.email 
					} 
			}).then(res => {
				if(res.status === HttpStatus.OK) {
					return res.data.data.user.role;
				}

				throw new InternalServerErrorException();
			}).catch(err => {
				throw new InternalServerErrorException();
			});

			return {
				id: user.id,
				email: user.email as string,
				name: user.info.name as string,
				role: role
			};

		}).catch(async err => {
			const res = await axios.post<{
				data: {
					user: any
				}
			}>(this.REST_HOST + '/users', {
				data: {
					user: {
						email: user.email,
						info: {
							name: user.name,
							description: ''
						},
						uploadQuota: {
							count: 5,
							uploadedAt: moment().tz('America/New_York').unix()
						}
					}
				}
			}).then(res => {
				if(res.status !== HttpStatus.CREATED) {
					throw new InternalServerErrorException();
				}

				return res;
			}).catch(err => {
				throw new InternalServerErrorException();
			});
			
			return {
				id: res.data.data.user.id,
				email: user.email,
				name: user.name,
				role: 'user'
			}
		});
  }

}
