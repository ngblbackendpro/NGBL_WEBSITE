const mongoose = require('mongoose');

const musicComplianceSchema = new mongoose.Schema({
    sectionKey: {
        type: String,
        required: true,
        unique: true
    },
    content: {
        type: String,
        required: true
    }
}, {timestamps: true});


module.exports = mongoose.model('MusicCompliance', musicComplianceSchema);