import { Storage, Bucket, File } from '@google-cloud/storage';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

const storage = new Storage({
    keyFilename: path.join(__dirname, '../json/fir-78726-firebase-adminsdk-34sx9-4fc57313af.json'),
    projectId: 'fir-78726',
});

const bucket: Bucket = storage.bucket('fir-78726.appspot.com');

export class FirebaseStorageService {
    /**
     * Uploads a file to Firebase Cloud Storage
     * @param file - The file object from the request
     * @param folder - Folder name to save the file under
     * @returns A promise that resolves to the public URL of the uploaded file
     */
    static async uploadFile(file: any, folder: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const fileName = `${folder}/${uuidv4()}_${file.originalname}`;
            const blob: File = bucket.file(fileName);
            const blobStream = blob.createWriteStream({
                resumable: false,
                contentType: file.mimetype,
                metadata: {
                    metadata: {
                        firebaseStorageDownloadTokens: uuidv4(),
                    },
                },
            });

            blobStream.on('error', (err) => {
                console.error("Error uploading file:", err);
                reject(err);
            });

            blobStream.on('finish', async () => {
                try {
                    await blob.makePublic();
                    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
                    resolve(publicUrl);
                } catch (error) {
                    reject(error);
                }
            });

            blobStream.end(file.buffer);
        });
    }
}
