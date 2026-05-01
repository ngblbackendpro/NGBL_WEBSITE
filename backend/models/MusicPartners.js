const mongoose = require('mongoose');
const partnerSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true
    }
}, {timestamps: true});

module.exports = mongoose.model('Partners', partnerSchema);