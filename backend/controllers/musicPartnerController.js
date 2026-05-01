const Partners = require('../models/MusicPartners');

exports.createPatners = async (req, res) => {
    try{
        let imageUrl = null;
        if(!req.file){
            return res.status(400).json({message: 'file not uploaded'});
        }
        imageUrl = req.file.path;
        const partner = new Partners({
            image: imageUrl
        });
        await partner.save();
        res.status(201).json({message: "partner logo has created"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};


exports.getAllPartners = async (req, res) => {
    try{
        const partners = await Partners.find().sort({createdAt : 1});
        if(!partners.length === 0){
            return res.json([]);
        }
        res.json(partners);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getSinglePartner = async (req, res) => {
    try{
        const partner = await Partners.findById(req.params.id);
        if(!partner){
            return res.status(404).json({message: "no logo exists"});
        }
        res.json(partner);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.deletePartners = async (req, res) => {
    try{
        const deleted = await Partners.findByIdAndDelete(req.params.id);
        if(!deleted){
            return res.status(404).json({message: 'no record found'});
        }
        res.json({message: "logo has deleted"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};