const MusicCompliance = require('../models/MusicCompliance');

exports.createMusicCompliance = async (req, res) => {
    try{
        const {sectionKey, content} = req.body;
        if(!sectionKey || !content){
            res.status(400).json({message: "required fields are empty"});
        }
        const existing = await MusicCompliance.findOne({sectionKey});
        if(existing){
            res.status(409).json({message: 'section key with this key is already exist'});
        }
        const newSection = new MusicCompliance({
            sectionKey,
            content
        });
        await newSection.save();
        res.status(201).json({message:'section added successfully'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getSectionKey = async (req, res)=> {
    try{
        const section = await MusicCompliance.findOne({sectionKey: req.params.key});
        if(!section){
            res.status(404).json({message: "section not exists"});
        }
        res.json(section);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getAllSections = async (req, res)=> {
    try{
        const sections = await MusicCompliance.find().sort({createdAt: 1});
        res.json(sections);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.updateSections = async (req, res) => {
    try{
        const { content } = req.body;
        if(!content){
            res.status(400).json({message: "input area is empty"});
        }
        const update = await MusicCompliance.findOneAndUpdate(
            {sectionKey: req.params.key},
            {content},
            {new: true}
        );
        if(!update){
            res.status(404).json({message: "Section not found"});
        }
        res.json({message: "Section has updated", data:update});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.deleteSection = async (req, res) => {
    try {
        const deleted = await MusicCompliance.findOneAndDelete({sectionKey: req.params.key});
            if(!deleted){
                res.status(404).json({message: "section not found"});
            }
            res.json({message: "Section has deleted"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};