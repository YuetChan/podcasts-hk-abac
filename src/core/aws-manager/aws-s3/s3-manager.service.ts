import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { InjectAwsService } from 'nest-aws-sdk';

@Injectable()
export class S3ManagerService {

  constructor(@InjectAwsService(S3) private readonly s3: S3) { }

  async generatePresignedUrlForUpload(bucket, key) {
    return this.s3.createPresignedPost({
      Bucket: bucket,
      Fields: { key: key },
      Conditions: [ ['content-length-range', 104857600] ],
      Expires: 1800
    });
  }

}