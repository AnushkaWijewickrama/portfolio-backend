import { IProject } from "../models/project";

const Project = require('../models/project');


export class ProjectService {
    static async saveProject(projectData: IProject): Promise<IProject> {
        const project = new Project(projectData);
        return await project.save();
    }
    static async getProjects() {
        return await Project.find();
    }
    static async deleteProject(id: string) {
        await Project.deleteMany({ _id: id });
        return await Project.find();
    }
    static async updateProject(
        id: string,
        data: {
            title?: string;
            description?: string;
            longDescription?: string;
            imagePath?: string[];
            projectYear?: string;
            projectType?: string;
        }
    ): Promise<any> {
        try {
            // Check if project exists before updating
            const projectDetails = await Project.findById(id);
            if (!projectDetails) {
                throw new Error("Project not found");
            }

            // Ensure `imagePath` is updated properly
            const updatedProject = await Project.findByIdAndUpdate(
                id,
                { $set: data }, // Use $set to explicitly update fields
                { new: true }
            );

            return updatedProject;
        } catch (error) {
            console.error("Error updating Project:", error);
            throw new Error(error instanceof Error ? error.message : "Error updating Project");
        }
    }
    static async getProjectById(id: string) {
        try {
            const project = await Project.findById(id);
            return project;
        } catch (error) {
            console.error("Error fetching project:", error);
            return null;
        }
    };
    static async updateProjectId(id: string, updates: any) {
        try {
            const updatedProductDetails = await Project.findByIdAndUpdate(id, updates, { new: true });
            return updatedProductDetails;
        } catch (error: any) {
            throw new Error(`Error updating product: ${error.message}`);
        }
    }
}

