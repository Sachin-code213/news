import mongoose from 'mongoose';

const electionSchema = new mongoose.Schema({
    candidateName: {
        type: String,
        required: [true, "Candidate name is required"],
        trim: true
    },
    partyName: {
        type: String,
        required: [true, "Party name is required"],
        trim: true
    },
    place: {
        type: String,
        required: [true, "Constituency/Place is required"],
        trim: true
    }, // 📍 New Field: e.g., "Kathmandu-4" or "Jhapa-1"
    partyLogo: {
        type: String,
        default: ''
    },
    partyColor: {
        type: String,
        default: '#e11d48'
    },
    votes: {
        type: Number,
        default: 0,
        min: 0
    },
    isLeading: {
        type: Boolean,
        default: false
    },
    isWinner: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true
});

// Optimization: Indexing votes and place for faster queries on the homepage
electionSchema.index({ votes: -1 });

export default mongoose.models.Election || mongoose.model('Election', electionSchema);