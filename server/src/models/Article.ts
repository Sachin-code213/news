import mongoose, { Schema, Document } from 'mongoose';

export interface IArticle extends Document {
    titleEn: string;
    titleNe: string;
    slug: string;
    contentEn: string;
    contentNe: string;
    isBreaking: boolean;
    isLive: boolean;
    // 🚀 NEW: Distinguish content format
    type: 'text' | 'video';
    videoUrl?: string; // YouTube Link
    category: string | mongoose.Types.ObjectId;
    image?: string; // Thumbnail for the video
    author: mongoose.Types.ObjectId;
    views: number;
}

const articleSchema = new Schema<IArticle>({
    titleEn: { type: String, required: true },
    titleNe: { type: String, default: '' },
    slug: { type: String, required: true, unique: true },
    contentEn: { type: String, required: true },
    contentNe: { type: String, default: '' },
    isBreaking: { type: Boolean, default: false },
    isLive: { type: Boolean, default: false },
    // 🚀 NEW FIELDS ADDED HERE
    type: {
        type: String,
        enum: ['text', 'video'],
        default: 'text'
    },
    videoUrl: { type: String, default: '' },
    category: { type: Schema.Types.Mixed, required: true },
    image: { type: String }, // Used as the video cover image
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    views: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.models.Article || mongoose.model<IArticle>('Article', articleSchema);