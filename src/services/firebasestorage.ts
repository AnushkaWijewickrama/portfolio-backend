import { Storage, Bucket, File } from '@google-cloud/storage';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as admin from 'firebase-admin';

const storage = new Storage({
    keyFilename: path.join(__dirname, '../../json/fir-78726-firebase-adminsdk-34sx9-4fc57313af.json'),
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
    static async deleteFile(fileUrl: string): Promise<void> {
        try {
            // Extract the file path from the URL (remove the Firebase Storage base URL)
            const filePath = fileUrl.split('googleapis.com/')[1];
            const storageRef = admin.storage().bucket().file(filePath);

            // Delete the file
            await storageRef.delete();

            console.log(`Successfully deleted file at ${filePath}`);
        } catch (error) {
            console.error('Error deleting file from Firebase Storage:', error);
            throw new Error('Failed to delete file from Firebase Storage');
        }
    }
    static async uploadFiles(files: any[], folder: string): Promise<string[]> {
        const uploadPromises = files.map((file) => this.uploadFile(file, folder));
        return Promise.all(uploadPromises);
    }
}
