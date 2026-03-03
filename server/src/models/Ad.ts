import mongoose from 'mongoose';

const adSchema = new mongoose.Schema({
    title: { type: String, required: true },
    imageUrl: { type: String, required: true },
    link: { type: String, required: true },
    position: {
        type: String,
        required: true,
        enum: [
            'top-leaderboard',
            'home-middle',
            'sidebar-top',
            'sidebar-sticky',
            'sidebar',
            'primary-sidebar',
            'top-banner',
            'in-article'
        ]
    },
    isActive: { type: Boolean, default: true },
    expiryDate: { type: Date }
}, { timestamps: true });

// 🚀 ADD THIS DEFAULT EXPORT
const Ad = mongoose.model('Ad', adSchema);
export default Ad;