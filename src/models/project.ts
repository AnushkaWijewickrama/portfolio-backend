import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IProject extends Document {
    title: string;
    description: string;
    longDescription: string;
    imagePath: string[];
    projectYear: string;
    projectType: string;
}

const projectSchema: Schema<IProject> = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    longDescription: { type: String },
    imagePath: [{ type: String }],
    projectYear: { type: String, required: true },
    projectType: { type: String, required: true },
});

const Project: Model<IProject> = mongoose.model<IProject>('Project', projectSchema);
module.exports = Project;