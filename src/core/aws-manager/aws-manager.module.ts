import { Module } from "@nestjs/common";
import { AwsSdkModule } from 'nest-aws-sdk';
import { S3, SharedIniFileCredentials } from "aws-sdk";

import { S3ManagerModule } from "./aws-s3/s3-manager.module";

@Module({
	imports: [
		S3ManagerModule,
		AwsSdkModule.forRoot({
			defaultServiceOptions: {
				region: 'us-east-1',
				credentials: new SharedIniFileCredentials({
					profile: 'default',
				}),
			},
			services: [S3],
		}),
	],
	providers: [],
	exports: [S3ManagerModule],
})
export class AwsManagerModule { }