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
export const updateProjectDetails = async (req: any, res: Response) => {
    // title: { type: String, required: true },
    // description: { type: String, required: true },
    // longDescription: { type: String },
    // imagePath: [{ type: String }],
    // projectYear: { type: String, required: true },
    // projectType: { type: String, required: true },
    try {
        const { id } = req.params;
        const { title, description, longDescription, projectYear, projectType } = req.body;

        // Find product details by ID
        const projectDetails = await ProjectService.getProjectById(id);
        if (!projectDetails) {
            return res.status(404).json({ error: "Product not found" });
        }

        let newImages: string[] = [];

        // Handle image uploads
        if (req.files && req.files.image) {
            const imageData = Array.isArray(req.files.image) ? req.files.image : [req.files.image];
            newImages = await FirebaseStorageService.uploadFiles(imageData, "projects");
        }

        // Retain existing images if necessary
        const updatedImages = projectDetails.imagePath.filter((data: any) =>
            req.body?.image?.includes(data)
        );
        const finalImages = updatedImages.concat(newImages);

        // Prepare updates
        const updates: Partial<typeof projectDetails> = {
            ...(title && { title }),
            ...(description && { description }),
            ...(longDescription && { longDescription }),
            ...(projectType && { projectType }),
            ...(projectYear && { projectYear }),
            imagePath: finalImages,
        };

        // Update product details
        const updatedProductDetails = await ProjectService.updateProjectId(id, updates);

        res.status(200).json(updatedProductDetails);
    } catch (error) {
        console.error("Error in updating product:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
export const getProject = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        console.log(id);
        const project = await ProjectService.getProjectById(id); // assuming ProjectService has this method
        console.log(project, '');
        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ message: "Error fetching project", error });
    }
};


