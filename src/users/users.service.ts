import { Injectable } from "@nestjs/common";
import { Content } from "src/contents/contents.service";
import { PrismaService } from "src/core/provider/prisma.service";

@Injectable()
export class UsersService {

  constructor(private readonly prismaSvc: PrismaService) { }

  async getUserById(
    id: number, withSubscriptions: boolean, withUploadQuota: boolean) {
    return await this.prismaSvc.user.findFirst({
      where: { id: id },
      include: { 
        subscriptions: withSubscriptions, 
        uploadQuota: withUploadQuota,
      }
    });
  }

  async getUserByEmail(
    email: string, withSubscriptions: boolean, withUploadQuota: boolean) {
    return await this.prismaSvc.user.findFirst({
      where: { email: email },
      include: { 
        subscriptions: withSubscriptions,
        uploadQuota: withUploadQuota 
      },
    });
  }

  async isUserExisted(id: number) {
    const result = (await this.prismaSvc.user.findMany({
      where: { id: id },
      include: { 
        subscriptions: false,
        uploadQuota: false 
      },
    }));

    return result !== null;
  }

  async createUser(user: User) {
    return await this.prismaSvc.user.create({
      data: {
        email: user.email,
        name: user.name,
        
        uploadQuota: { create: { count: user.uploadQuota.count } }
      }
    });
  }

  async updateUserInfo(user: User) {
    return await this.prismaSvc.user.update({
      data: {
        name: user.name,
        description: user.description
      },
      where: { email: user.email }
    });
  }

  async updateUserUploadQuota(user: User) {
    const uploadQuota = user.uploadQuota;
    return await this.prismaSvc.user.update({
      data: {
        uploadQuota: {
          update: {
            uploadedAt: uploadQuota.uploadedAt, 
            count: uploadQuota.count,
          }
        }
      },
      where: { email: user.email }
    });
  }

}

export class User {
  id?: number;
  email: string;

	name?: string;
  role?: string;
  description?: string;

  content?: Content[];
  uploadQuota?: UploadQuota;

  playHistory?: PlayHistory
}

export interface UploadQuota {
  uploadedAt?: number;
  count?: number;
}

export interface PlayHistory {
  id?: number
  histroyId: number;
  contentId: number;

  playedAt: number;
  createdAt: number;
}

