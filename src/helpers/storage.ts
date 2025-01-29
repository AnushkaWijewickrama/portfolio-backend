import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';
// Define the file filter function with types
const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback): void => {
    const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    allowedMimeTypes.includes(file.mimetype) ? cb(null, true) : cb(null, false);
};

// Use memory storage for multer
const multerStorage = multer.memoryStorage();

// Set up the multer configuration
const upload = multer({
    storage: multerStorage,
    fileFilter: fileFilter,
}).fields([
    { name: 'image', maxCount: 20 },
]);

module.exports = upload;
