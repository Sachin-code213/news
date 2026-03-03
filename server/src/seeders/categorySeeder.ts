import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from '../models/Category';

dotenv.config();

const categories = [
    { nameEn: 'Politics', nameNp: 'राजनीति', slug: 'politics' },
    { nameEn: 'Technology', nameNp: 'प्रविधि', slug: 'technology' },
    { nameEn: 'Sports', nameNp: 'खेलकुद', slug: 'sports' },
    { nameEn: 'Entertainment', nameNp: 'मनोरञ्जन', slug: 'entertainment' },
    { nameEn: 'Health', nameNp: 'स्वास्थ्य', slug: 'health' }
];

const seedCategories = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI!);
        await Category.deleteMany(); // Clears existing to avoid duplicates
        await Category.insertMany(categories);
        console.log('✅ Categories Seeded Successfully!');
        process.exit();
    } catch (error) {
        console.error('❌ Seeding Error:', error);
        process.exit(1);
    }
};

seedCategories();