import { Multer } from 'multer';

declare global {
    namespace Express {
        export interface Request {
            files?: Multer.File[] | { [fieldname: string]: Multer.File[] };
            file?: Multer.File;
        }
    }
}
