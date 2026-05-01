const mongoose = require('mongoose');

const musicBlog = new mongoose.Schema({
    workTitle:{
        type: String,
        required: true
    },
    workDescription:{
        type: String,
        required: true
    },
    workLink:{
        type: String,
        required: true
    },
    workImageLabel:{
        type: String,
        required: true
    }
}, {timestamps: true});

module.exports = mongoose.model("musicBlog", musicBlog);