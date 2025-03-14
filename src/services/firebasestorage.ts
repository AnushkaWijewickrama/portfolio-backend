import { Storage, Bucket, File } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';
import * as admin from 'firebase-admin';


const credentials = {
    "type": "service_account",
    "project_id": process.env.FIREBASE_PROJECT_ID,
    "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
    "private_key": process.env.FIREBASE_PRIVATE_KEY,
    "client_email": process.env.FIREBASE_CLIENT_EMAIL,
    "client_id": process.env.FIREBASE_CLIENT_ID,
    "auth_uri": process.env.FIREBASE_AUTH_URI,
    "token_uri": process.env.FIREBASE_TOKEN_URI,
    "auth_provider_x509_cert_url": process.env.FIREBASE_AUTH_PROVIDER_CERT,
    "client_x509_cert_url": process.env.FIREBASE_CLIENT_CERT,
    "universe_domain": "googleapis.com"
}

const storage = new Storage({
    credentials: credentials,
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
