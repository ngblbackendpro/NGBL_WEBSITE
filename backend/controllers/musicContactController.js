const MusicContact = require('../models/MusicContact');

exports.createMusicContact = async (req, res) => {
    try {
        const {name, projectName, role, requirementType, genreLanguage, budget, timeline, contact, portfolio, brief} = req.body;
        if (!name || !role || !requirementType || !contact){
            res.status(400).json({message: "required fields are empty"});
        }
        const newContact = new MusicContact({
            name,
            projectName,
            role,
            requirementType,
            genreLanguage,
            budget,
            timeline,
            contact,
            portfolio,
            brief
        });

        await newContact.save();
        res.status(201).json({message: 'contact saved successfully'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};