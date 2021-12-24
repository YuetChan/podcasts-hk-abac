import { Injectable } from "@nestjs/common";
import * as moment from "moment";

import { PrismaService } from "src/core/provider/prisma.service";

@Injectable()
export class ContentsService {

	constructor(private readonly prismaSvc: PrismaService) { }

	async getContentById(id) { return await this.prismaSvc.content.findFirst({ where: { id: id } }); }

	async getAllContents(startDate, endDate) { 
		const startDate_ = moment(startDate).startOf('day').unix();
		const endDate_ = moment(endDate).startOf('day').unix();

		return await this.prismaSvc.content.findMany({ 
			where: { 
				AND: [{
						createdAt: { gte: startDate_ }
					},{
						createdAt: { lte: endDate_ }
					}] 
			} 
		}); 
	}

	async createContent(content: Content) {
		return await this.prismaSvc.content.create({
			data: {
				user: { connect: { id: content.userId } },

				title: content.title,
				description: content.description,

				source: content.source,
				categories: { connect: content.categories.map(cat => ({ name: cat })) },

				ord: content.ord,
				createdAt: moment().unix()
			}
		});
	}

	async updateContentInfo({
		id, 
		userId, title, description, 
		categories, ord
	}) {
		return await this.prismaSvc.content.update({
      data: {
				user: { connect: { id: userId } },

				title: title,
				description: description,
	
				categories: { update: categories },
				ord: ord
      },
      where: { id: id }
    });
	}

	async updateContentMedia({id, duration, mediaType}) {
		return await this.prismaSvc.content.update({
      data: {
				duration: duration,
				mediaType: mediaType
      },
      where: { id: id }
    });
	}
}

export class Content {
	id?: number;
	userId?: number;
	email?: string;

	title: string;
	description: string;

	duration: number;
	mediaType: string;
	source: string;

	categories: [];
	tags: [];

	ord?: number;
	createdAt?: number;
}