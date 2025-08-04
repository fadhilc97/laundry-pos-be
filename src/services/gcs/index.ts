import { Storage } from "@google-cloud/storage";
import { ReadStream } from "fs";
import { Readable } from "stream";

const storage = new Storage({
  credentials: {
    client_email: process.env.GCP_CLIENT_EMAIL,
    project_id: process.env.GCP_PROJECT_ID,
    private_key_id: process.env.GCP_PRIVATE_KEY_ID,
    private_key: process.env.GCP_PRIVATE_KEY,
  },
});

const bucket = storage.bucket(process.env.GCS_BUCKET_NAME as string);

export function getFileStream(fileName: string) {
  return bucket.file(fileName).createReadStream();
}

export async function uploadFileStream(
  fileName: string,
  fileBuffer: Buffer | ReadStream
) {
  const file = bucket.file(fileName);
  let stream;

  if (Buffer.isBuffer(fileBuffer)) {
    stream = Readable.from(fileBuffer).pipe(file.createWriteStream());
  } else {
    stream = fileBuffer.pipe(file.createWriteStream());
  }

  await new Promise((resolve, reject) => {
    stream.on("finish", resolve);
    stream.on("error", reject);
  });
}
