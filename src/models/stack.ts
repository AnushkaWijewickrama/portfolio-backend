import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IStack extends Document {
    title: string;
    description: string;
    imagePath: string
}

const stackSchema: Schema<IStack> = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    imagePath: [{ type: String }],
});

const Stack: Model<IStack> = mongoose.model<IStack>('Stack', stackSchema);
module.exports = Stack;