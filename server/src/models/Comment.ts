import mongoose, { Document, Schema } from 'mongoose';

export interface IComment extends Document {
    content: string;
    user: mongoose.Schema.Types.ObjectId;
    article: mongoose.Schema.Types.ObjectId;
    parentComment?: mongoose.Schema.Types.ObjectId;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: Date;
    updatedAt: Date;
}

const CommentSchema: Schema = new Schema({
    content: {
        type: String,
        required: [true, 'Comment cannot be empty'],
        maxlength: 1000
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    article: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article',
        required: true
    },
    parentComment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        default: null
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'approved' // Auto-approve for now, change to pending for strict moderation
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model<IComment>('Comment', CommentSchema);
