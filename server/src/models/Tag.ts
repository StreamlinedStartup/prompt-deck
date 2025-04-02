import mongoose, { Schema, Document } from 'mongoose';

export interface ITag extends Document {
  name: string;
  color?: string; // Optional color
  createdAt: Date;
}

const TagSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Tag name is required'],
    unique: true,
    trim: true,
  },
  color: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<ITag>('Tag', TagSchema);