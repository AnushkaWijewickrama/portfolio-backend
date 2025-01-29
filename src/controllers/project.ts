import { Request, Response } from 'express';
import { FirebaseStorageService } from '../services/firebasestorage';
import { ProjectService } from '../services/project';

export const getProjects = async (req: Request, res: Response) => {
    try {
        const projects = await ProjectService.getProjects();
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: "Error fetching projects", error });
    }
};
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
export const deleteProductDetails = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updatedProjects = await ProjectService.deleteProject(id);
        res.status(201).json(updatedProjects);
    } catch (error) {
        res.status(500).json({ message: "Error deleting project", error });
    }
};
export const updateProject = async (req: any, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { title, description, longDescription, projectYear, projectType } = req.body;

        const projectDetails = await ProjectService.getProjectById(id);
        if (!projectDetails) {
            res.status(404).json({ error: "Project not found" });
            return;
        }

        const imageData: Express.Multer.File[] | undefined = req?.files?.image as Express.Multer.File[];

        console.log("Received files:", req.files);

        let imagePath: string[] = [];

        try {
            if (imageData && imageData.length > 0) {
                console.log("Uploading new images to Firebase...");

                const uploadPromises = imageData.map((file) =>
                    FirebaseStorageService.uploadFile(file, 'project')
                );

                const uploadedImages = await Promise.all(uploadPromises);
                console.log("Uploaded Images:", uploadedImages);

                imagePath = uploadedImages;  // Replace the existing images with new ones
            } else {
                console.log("No new images provided, retaining old images...");
                imagePath = projectDetails.imagePath || [];
            }
        } catch (uploadError) {
            console.error("Error uploading images to Firebase:", uploadError);
            res.status(500).json({ message: "Image upload failed." });
            return;
        }

        const updatedProject = await ProjectService.updateProject(id, {
            title,
            description,
            longDescription,
            imagePath,  // Use the updated image path
            projectYear,
            projectType
        });

        res.status(200).json({ project: updatedProject });
    } catch (error) {
        console.error("Error updating project:", error);
        res.status(500).json({ message: "Project update failed." });
    }
};


