const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true
    }
}, {timestamps: true});


module.exports = mongoose.model('Media', mediaSchema);