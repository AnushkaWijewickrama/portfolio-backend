import { IStack } from "../models/stack";

const Stack = require('../models/stack');


export class StackService {
    static async saveStack(projectData: IStack): Promise<IStack> {
        const project = new Stack(projectData);
        return await project.save();
    }

    static async getStacks() {
        return await Stack.find();
    }
    static async deleteStack(id: string) {
        await Stack.deleteMany({ _id: id });
        return await Stack.find();
    }
    static async updateStack(
        id: string,
        data: {
            title?: string;
            description?: string;
            imagePath?: string
        }
    ): Promise<any> {
        try {
            // Check if Stack exists before updating
            const StackDetails = await Stack.findById(id);
            if (!StackDetails) {
                throw new Error("Stack not found");
            }

            // Ensure `imagePath` is updated properly
            const updatedStack = await Stack.findByIdAndUpdate(
                id,
                { $set: data }, // Use $set to explicitly update fields
                { new: true }
            );

            return updatedStack;
        } catch (error) {
            console.error("Error updating Stack:", error);
            throw new Error(error instanceof Error ? error.message : "Error updating Stack");
        }
    }
    static async getStackById(id: string) {
        try {
            const stack = await Stack.findById(id);
            return stack;
        } catch (error) {
            console.error("Error fetching Stack:", error);
            return null;
        }
    };
    static async updateStackId(id: string, updates: any) {
        try {
            const updatedProductDetails = await Stack.findByIdAndUpdate(id, updates, { new: true });
            return updatedProductDetails;
        } catch (error: any) {
            throw new Error(`Error updating product: ${error.message}`);
        }
    }
}

