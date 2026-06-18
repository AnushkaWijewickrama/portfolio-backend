import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!
});

export class CloudinaryStorageService {

    static async uploadFile(
        file: Express.Multer.File,
        folder: string
    ): Promise<string> {

        return new Promise((resolve, reject) => {

            const stream = cloudinary.uploader.upload_stream(
                {
                    folder,
                    resource_type: 'auto'
                },
                (error, result) => {

                    if (error) {
                        reject(new Error(`Upload failed: ${error.message}`));
                        return;
                    }

                    resolve(result!.secure_url);
                }
            );

            streamifier.createReadStream(file.buffer).pipe(stream);
        });
    }

    static async uploadFiles(
        files: Express.Multer.File[],
        folder: string
    ): Promise<string[]> {

        return Promise.all(
            files.map(file => this.uploadFile(file, folder))
        );
    }

    static async deleteFile(fileUrl: string): Promise<void> {

        const parts = fileUrl.split('/');
        const filename = parts.pop()?.split('.')[0];

        if (!filename) {
            throw new Error('Invalid file URL');
        }

        const { result } = await cloudinary.uploader.destroy(filename);

        if (result !== 'ok') {
            throw new Error('Delete failed');
        }

        console.log(`Deleted: ${filename}`);
    }
}