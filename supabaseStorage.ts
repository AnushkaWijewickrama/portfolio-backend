import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
);

const BUCKET_NAME = process.env.SUPABASE_BUCKET!;

export class SupabaseStorageService {
    static async uploadFile(file: Express.Multer.File, folder: string): Promise<string> {
        const key = `${folder}/${uuidv4()}_${file.originalname}`;

        const { error } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(key, file.buffer, { contentType: file.mimetype });

        if (error) throw new Error(`Upload failed: ${error.message}`);

        const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(key);
        return data.publicUrl;
    }

    static async uploadFiles(files: Express.Multer.File[], folder: string): Promise<string[]> {
        return Promise.all(files.map((file) => this.uploadFile(file, folder)));
    }

    static async deleteFile(fileUrl: string): Promise<void> {
        const key = fileUrl.split(`${BUCKET_NAME}/`)[1];
        const { error } = await supabase.storage.from(BUCKET_NAME).remove([key]);
        if (error) throw new Error(`Delete failed: ${error.message}`);
        console.log(`Successfully deleted file: ${key}`);
    }
}