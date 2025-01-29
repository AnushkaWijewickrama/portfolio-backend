import { IProject } from "../models/project";

const Project = require('../models/project');


export class ProjectService {
    static async saveProject(projectData: IProject): Promise<IProject> {
        const project = new Project(projectData);
        return await project.save();
    }
}