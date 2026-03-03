import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: 'user' | 'journalist' | 'editor' | 'admin';
    avatar?: string;
    bio?: string;
    // 🚀 Pro Features
    isPro: boolean;
    isProInterested: boolean;
    matchPassword(enteredPassword: string): Promise<boolean>;
    getSignedJwtToken(): string;
}

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false
    },
    role: {
        type: String,
        enum: ['user', 'journalist', 'editor', 'admin'],
        default: 'user'
    },
    // 🚀 NEW: Pro Status Fields
    isPro: {
        type: Boolean,
        default: false
    },
    isProInterested: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

// Encrypt password using bcrypt
userSchema.pre<IUser>('save', async function () {
    if (!this.isModified('password')) {
        return;
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (err: any) {
        throw err;
    }
});

userSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.getSignedJwtToken = function (): string {
    return jwt.sign(
        { id: this._id, role: this.role, isPro: this.isPro }, // Included isPro in token for quick frontend checks
        process.env.JWT_SECRET || 'secret_fallback_key',
        { expiresIn: '30d' }
    );
};

export default mongoose.model<IUser>('User', userSchema);