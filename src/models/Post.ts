import mongoose, { Schema, Document } from 'mongoose';

// Define the Post interface to match your schema
export interface PostType extends Document {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  media?: { url: string; type: 'image' | 'video' }[];
  createdAt: Date;
  updatedAt?: Date;
}

export type PostLean = Omit<PostType, keyof Document | 'createdAt' | 'updatedAt'> & { _id: string, title: string, createdAt: string, updatedAt?: string };

const PostSchema = new Schema<PostType>({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  excerpt: { type: String },
  media: [{
    url: { type: String, required: true },
    type: { type: String, enum: ['image', 'video'], required: true },
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
});

export default mongoose.models.Post || mongoose.model<PostType>('Post', PostSchema);