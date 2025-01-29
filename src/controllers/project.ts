import { Request, Response } from 'express';
import { FirebaseStorageService } from '../services/firebasestorage';
import { IProject } from '../models/project';
import { ProjectService } from '../services/project';

export const postProject = async (req: any, res: Response): Promise<void> => {
    const { title, description, longDescription, projectYear, projectType } = req.body;
    const imageData: Express.Multer.File[] | undefined = req?.files?.image as Express.Multer.File[];
    const imagePath: string[] = [];

    try {
        // Process image uploads
        if (Array.isArray(imageData) && imageData.length > 0) {
            const uploadPromises = imageData.map((file) =>
                FirebaseStorageService.uploadFile(file, 'project')
            );
            const uploadedImages = await Promise.all(uploadPromises);
            imagePath.push(...uploadedImages);
        } else {
            res.status(400).json({ message: 'No images provided.' });
            return;
        }

        // Save product to the database
        const projectData: any = {
            title,
            description,
            longDescription,
            imagePath,
            projectYear,
            projectType,
        };

        // Save project using the service class
        const createdProject = await ProjectService.saveProject(projectData)

        const createdProduct = await createdProject.save();
        res.status(201).json({ product: createdProduct });
    } catch (error) {
        console.error("Error processing images:", error);
        res.status(500).json({ message: 'Image processing failed.' });
    }
};