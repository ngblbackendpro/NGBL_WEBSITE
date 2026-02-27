const mongoose = require('mongoose');

const officeSchema = new mongoose.Schema({
    location: { type: String, required: true },
    address: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true }
}, { _id: true });

const homeSchema = new mongoose.Schema({
    expYears: { type: Number, default: 0 },
    totalProjects: { type: Number, default: 0 },
    offices: [officeSchema],
    companyInfo: {
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    address: { type: String, default: '' }
        },
    socialLinks: {
        facebook: { type: String, default: '' },
        twitter: { type: String, default: '' },
        linkedin: { type: String, default: '' },
        instagram: { type: String, default: '' },
        youtube: { type: String, default: '' }
    }
}, { timestamps: true });

module.exports = mongoose.model('Home', homeSchema);
