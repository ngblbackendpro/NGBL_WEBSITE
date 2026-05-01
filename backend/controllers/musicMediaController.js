const Media = require('../models/MusicMedia');

exports.createMedia = async (req, res) => {
    try{
        let imageUrl = null;
        if(!req.file){
           return res.status(400).json({message: "file not uploaded"});
        }
        imageUrl = req.file.path;

        const media = new Media({
            image: imageUrl
        });
        await media.save();
        res.status(201).json({message: "media has created"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getAllMedia = async(req, res)=> {
    try{
        const media = await Media.find().sort({ createdAt: 1});
        if(media.length === 0){
           return res.json([]);
        }
        res.json(media);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getSingleMedia = async (req, res) => {
    try{
        const media = await Media.findById(req.params.id);
        if(!media){
           return res.status(404).json({message: "no media found"});
        }
        res.json(media);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.updateMedia = async (req, res) => {
    try{
        let imageUrl = null;
        if(!req.file){
           return res.status(400).json({message: "no file uploaded"});
        }
        imageUrl = req.file.path;

        const updated = await Media.findByIdAndUpdate(req.params.id,
            {image: imageUrl},
            {new:true}
        );
        if(!updated){
           return res.status(404).json({message: "no media found"});
        }
        res.json({message: "media has updated", data:updated});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};


exports.deleteMedia = async (req, res) => {
    try{
        const deleted = await Media.findByIdAndDelete(req.params.id);
        if(!deleted){
           return res.status(404).json({message: "no media found"});
        }
        res.json({message: "media has deleted"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};