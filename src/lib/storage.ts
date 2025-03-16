import env from "@/env";
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

export class FileStorage {
  private s3: S3Client;

  public constructor() {
    this.s3 = new S3Client({
      endpoint: env.MINIO_URL,
      region: "us-east-1",
      credentials: {
        accessKeyId: env.MINIO_ACCESS_ID,
        secretAccessKey: env.MINIO_ACCESS_KEY,
      },
      forcePathStyle: true,
    });
  }

  public async uploadFile(
    bucket: string,
    key: string,
    contentType: string,
    file: Buffer
  ) {
    return await this.s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: file,
        ContentType: contentType,
      })
    );
  }

  public async getFile(bucket: string, key: string) {
    const res = await this.s3.send(
      new GetObjectCommand({
        Bucket: bucket,
        Key: key,
      })
    );

    if (!res.Body) {
      throw new Error("Body not received.");
    }

    const buf = await res.Body.transformToByteArray();

    return buf;
  }
}

export const filestore = new FileStorage();
