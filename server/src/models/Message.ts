import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
    name: string;
    email: string;
    message: string;
    status: 'unread' | 'read' | 'replied';
    createdAt: Date;
}

const MessageSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Sender name is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email']
    },
    message: {
        type: String,
        required: [true, 'Message body cannot be empty']
    },
    // 🚀 Flexible status for "Read Receipts"
    status: {
        type: String,
        enum: ['unread', 'read', 'replied'],
        default: 'unread'
    }
}, { timestamps: true });

export default mongoose.model<IMessage>('Message', MessageSchema);