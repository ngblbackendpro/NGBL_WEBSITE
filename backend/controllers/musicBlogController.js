const MusicBlog = require('../models/MusicBlog');

exports.createMusicBlog = async (req, res) => {
    try{
        const { workTitle, workDescription, workLink } = req.body;
        let musicImg = null;
        if(req.file){
            musicImg = req.file.path;
        }
        const newMusicBlog = new MusicBlog({
            workTitle,
            workDescription,
            workLink,
            workImageLabel: musicImg
        });
        await newMusicBlog.save();
        res.status(201).json({message: "Blog Added Successfully"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getMusicBlog = async (req, res) => {
    try {
        const musicBlog = await MusicBlog.find().sort ({createdAt : -1});
        res.json(musicBlog);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.deleteMusicBlog = async (req, res) => {
    try {
        await MusicBlog.findByIdAndDelete(req.params.id);
        res.json({message: "selected blog has deleted"})
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getSingleMusicBlog = async (req, res) => {
    try{
        const musicBlog = await MusicBlog.findById(req.params.id);
        if(!musicBlog) {
            res.status(404).json({message: "blog not found"});
        }
        res.json(musicBlog);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};

exports.updateMusicBlog = async (req, res) => {
    try {
        const { workTitle, workDescription, workLink } = req.body;
        const updateData = { workTitle, workDescription, workLink };

        if (req.file) {
            updateData.workImageLabel = req.file.path;
        }

        const updated = await MusicBlog.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );
        if (!updated) {
            return res.status(404).json({ message: "Blog not found" });
        }
        res.json({ message: "Blog updated successfully", data: updated });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};