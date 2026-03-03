import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
    nameEn: string;
    nameNe: string;
    slug: string;
}

const categorySchema = new Schema<ICategory>({
    nameEn: { type: String, required: true, unique: true, trim: true },
    nameNe: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true }
}, {
    timestamps: true,
    collection: 'portal_categories',
    // autoIndex: false // 🚀 Keep this false if you are still getting 'name_1' errors
});

// Use the standard pattern to prevent double-registration in development
export default mongoose.models.Category || mongoose.model<ICategory>('Category', categorySchema);