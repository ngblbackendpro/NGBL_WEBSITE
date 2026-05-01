const mongoose = require('mongoose');

const musicContact = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    projectName: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    requirementType: {
        type: String,
        required: true
    },
    genreLanguage: {
        type: String,
        required: true
    },
    budget: {
        type: String,
        required: true
    },
    timeline: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    portfolio: {
        type: String,
        required: true
    },
    brief: {
        type: String,
        required: true
    }

}, {timestamps: true});

module.exports = mongoose.model("MusicContact", musicContact);