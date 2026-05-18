import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

let _s3: S3Client | null = null;

export function getS3(): S3Client {
  if (!_s3) {
    _s3 = new S3Client({
      region: process.env.S3_REGION ?? "eu-central-1",
      endpoint: process.env.S3_ENDPOINT ?? "https://hel1.your-objectstorage.com",
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY!,
        secretAccessKey: process.env.S3_SECRET_KEY!,
      },
      forcePathStyle: true,
    });
  }
  return _s3;
}

export async function uploadToS3(params: {
  key: string;
  body: Buffer | Uint8Array | string;
  contentType: string;
  bucket?: string;
}): Promise<string> {
  const s3 = getS3();
  const bucket = params.bucket ?? process.env.S3_BUCKET!;

  const upload = new Upload({
    client: s3,
    params: {
      Bucket: bucket,
      Key: params.key,
      Body: params.body,
      ContentType: params.contentType,
    },
  });

  await upload.done();

  const endpoint = process.env.S3_PUBLIC_ENDPOINT ?? process.env.S3_ENDPOINT!;
  return `${endpoint}/${bucket}/${params.key}`;
}

export async function uploadBuffer(params: {
  key: string;
  buffer: Buffer;
  contentType: string;
  bucket?: string;
}): Promise<string> {
  const s3 = getS3();
  const bucket = params.bucket ?? process.env.S3_BUCKET!;

  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: params.key,
      Body: params.buffer,
      ContentType: params.contentType,
    }),
  );

  const endpoint = process.env.S3_PUBLIC_ENDPOINT ?? process.env.S3_ENDPOINT!;
  return `${endpoint}/${bucket}/${params.key}`;
}

export async function downloadBuffer(params: {
  key: string;
  bucket?: string;
}): Promise<Buffer> {
  const s3 = getS3();
  const bucket = params.bucket ?? process.env.S3_BUCKET!;

  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: params.key,
  });

  const response = await s3.send(command);

  if (!response.Body) {
    throw new Error(`S3 object not found: ${params.key}`);
  }

  const chunks: Uint8Array[] = [];
  for await (const chunk of response.Body as AsyncIterable<Uint8Array>) {
    chunks.push(chunk);
  }

  return Buffer.concat(chunks);
}
