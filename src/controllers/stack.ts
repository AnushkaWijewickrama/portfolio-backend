import { Request, Response } from 'express';
import { FirebaseStorageService } from '../services/firebasestorage';
import { StackService } from '../services/stack';

export const getStacks = async (req: Request, res: Response) => {
    try {
        const stacks = await StackService.getStacks();
        res.status(200).json(stacks);
    } catch (error) {
        res.status(500).json({ message: "Error fetching stacks", error });
    }
};

export const postStack = async (req: any, res: Response): Promise<void> => {
    const { title, description } = req.body;
    const imageData: Express.Multer.File[] | undefined = req?.files?.image as Express.Multer.File[];
    const imagePath: string[] = [];

    try {
        // Process image uploads
        if (Array.isArray(imageData) && imageData.length > 0) {
            const uploadPromises = imageData.map((file) =>
                FirebaseStorageService.uploadFile(file, 'stack')
            );
            const uploadedImages = await Promise.all(uploadPromises);
            imagePath.push(...uploadedImages);
        } else {
            res.status(400).json({ message: 'No images provided.' });
            return;
        }

        // Save stack to the database
        const stackData: any = {
            title,
            description,
            imagePath
        };

        // Save stack using the service class
        const createdStack = await StackService.saveStack(stackData);

        const createdStackDetails = await createdStack.save();
        res.status(201).json({ stack: createdStackDetails });
    } catch (error) {
        console.error("Error processing images:", error);
        res.status(500).json({ message: 'Image processing failed.' });
    }
};

export const deleteStackDetails = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updatedStacks = await StackService.deleteStack(id);
        res.status(201).json(updatedStacks);
    } catch (error) {
        res.status(500).json({ message: "Error deleting stack", error });
    }
};

export const updateStackDetails = async (req: any, res: Response) => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;

        // Find stack details by ID
        const stackDetails = await StackService.getStackById(id);
        if (!stackDetails) {
            return res.status(404).json({ error: "Stack not found" });
        }

        let newImages: string[] = [];

        // Handle image uploads
        if (req.files && req.files.image) {
            const imageData = Array.isArray(req.files.image) ? req.files.image : [req.files.image];
            newImages = await FirebaseStorageService.uploadFiles(imageData, "stacks");
        }

        // Retain existing images if necessary
        const updatedImages = stackDetails.imagePath.filter((data: any) =>
            req.body?.image?.includes(data)
        );
        const finalImages = updatedImages.concat(newImages);

        // Prepare updates
        const updates: Partial<typeof stackDetails> = {
            ...(title && { title }),
            ...(description && { description }),
            imagePath: finalImages,
        };

        // Update stack details
        const updatedStackDetails = await StackService.updateStackId(id, updates);

        res.status(200).json(updatedStackDetails);
    } catch (error) {
        console.error("Error in updating stack:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getStack = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const stack = await StackService.getStackById(id); // assuming StackService has this method
        res.status(200).json(stack);
    } catch (error) {
        res.status(500).json({ message: "Error fetching stack", error });
    }
};
