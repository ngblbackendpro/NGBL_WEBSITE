const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
    quote: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    }
}, {timestamps: true});

module.exports = mongoose.model('Testimonials', testimonialSchema);