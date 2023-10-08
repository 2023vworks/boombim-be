import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import * as crypto from 'crypto';

import { AwsConfig } from '@app/config';

export const UploadServiceToken = Symbol('UploadServiceToken');
export interface UploadService {
  feedFilesUpload(
    userId: number,
    feedId: number,
    files: Express.Multer.File[],
  ): Promise<string[]>;
}

@Injectable()
export class UploadServiceImpl implements UploadService {
  private readonly client: S3Client;
  private readonly bucket: string;

  constructor(private readonly config: ConfigService) {
    const aws = this.config.get<AwsConfig>('aws');
    this.bucket = aws.bucketName;
    this.client = new S3Client({
      credentials: { accessKeyId: aws.accessKey, secretAccessKey: aws.secret },
      region: aws.region,
    });
  }

  async feedFilesUpload(
    userId: number,
    feedId: number,
    files: Express.Multer.File[],
  ): Promise<string[]> {
    const fileNames = files.map(() => this.createKey(userId, feedId));
    const commands = files.map(
      (file, i) =>
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: fileNames[i],
          Body: file.buffer,
        }),
    );
    const promises = commands.map((command) => this.client.send(command));
    await Promise.all(promises);
    return fileNames;
  }

  private createKey(userId: number, feedId: number) {
    const uuid = crypto.randomUUID();
    return `u${userId}-f${feedId}-${uuid.split('-').slice(0, 1)}-${Date.now()}`;
  }
}
