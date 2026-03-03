import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
    // Branding
    siteName: { type: String, default: 'KhabarPoint' },
    siteLogo: { type: String },
    footerText: { type: String, default: '© 2026 KhabarPoint. All Rights Reserved.' },

    // Social Links
    facebookUrl: { type: String, default: '' },
    twitterUrl: { type: String, default: '' },
    youtubeUrl: { type: String, default: '' },
    instagramUrl: { type: String, default: '' },

    // SEO
    metaTitle: { type: String, default: 'KhabarPoint | News Portal' },
    metaDescription: { type: String, default: '' },
    metaKeywords: { type: String, default: '' },

    // System
    maintenanceMode: { type: Boolean, default: false },
    enableComments: { type: Boolean, default: true },

    // 🇳🇵 Election Tally System
    showElectionTally: { type: Boolean, default: false }, // Master Switch
    electionTitle: { type: String, default: 'Election 2082 Live Results' },
    electionStatus: { type: String, default: 'Counting in Progress' }
}, { timestamps: true });

// 🚀 FIX: Ensures we don't overwrite the model if it's already compiled
const Settings = mongoose.models.Settings || mongoose.model('Settings', settingsSchema);

export default Settings;