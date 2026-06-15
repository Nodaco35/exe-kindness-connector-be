import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class UploadService {
  constructor() {
    cloudinary.config({
      cloud_name: 'dghh32sv0',
      api_key: '312759821854312',
      api_secret: 'sjEkJ54lCoC9oyzrUFVXvH42OH8',
    });
  }

  uploadImage(file: Express.Multer.File): Promise<any> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'kindness-connector' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );
      Readable.from(file.buffer).pipe(uploadStream);
    });
  }
}
