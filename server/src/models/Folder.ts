import mongoose, { Schema, Document } from 'mongoose';

export interface IFolder extends Document {
  name: string;
  description?: string;
  createdAt: Date;
}

const FolderSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Folder name is required'],
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<IFolder>('Folder', FolderSchema);