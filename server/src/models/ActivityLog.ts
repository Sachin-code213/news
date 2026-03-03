import mongoose, { Document, Schema } from 'mongoose';

export interface IActivityLog extends Document {
    user: mongoose.Schema.Types.ObjectId;
    action: string;
    target: string;
    details?: any;
    ipAddress?: string;
    userAgent?: string;
    createdAt: Date;
}

const ActivityLogSchema: Schema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    action: {
        type: String,
        required: true,
        enum: ['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'PUBLISH', 'BLOCK']
    },
    target: {
        type: String, // e.g., 'Article: 12345'
        required: true
    },
    details: {
        type: Schema.Types.Mixed
    },
    ipAddress: String,
    userAgent: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model<IActivityLog>('ActivityLog', ActivityLogSchema);
