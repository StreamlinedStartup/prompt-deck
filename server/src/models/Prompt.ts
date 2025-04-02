import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IPrompt extends Document {
  title: string;
  content: string;
  description?: string;
  tags: Types.ObjectId[];
  folder?: Types.ObjectId | null; // Optional folder reference
  createdAt: Date;
  updatedAt: Date;
}

const PromptSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Prompt title is required'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Prompt content is required'],
    },
    description: {
      type: String,
      trim: true,
    },
    tags: [{
      type: Schema.Types.ObjectId,
      ref: 'Tag', // Reference to the Tag model
    }],
    folder: {
      type: Schema.Types.ObjectId,
      ref: 'Folder', // Reference to the Folder model
      default: null,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// Indexing for potential search improvements
PromptSchema.index({ title: 'text', description: 'text', content: 'text' });

export default mongoose.model<IPrompt>('Prompt', PromptSchema);