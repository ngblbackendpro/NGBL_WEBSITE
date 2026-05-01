const Testimonials = require('../models/Testimonials');

exports.createTestimonials = async (req, res) => {
    try{
        const { quote, author } = req.body;
        if(!quote || !author){
           return res.status(400).json({message: "required fields are empty"});
        }
        const testimonials = new Testimonials({
            quote,
            author
        });
        await testimonials.save();
        res.status(201).json({message: "Testimonial has added"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};


exports.getAllTestimonials = async (req, res) => {
    try{
        const testimonials = await Testimonials.find().sort({ createdAt : -1 });
        if(!testimonials){
          return  res.status(404).json({ message: "No Testimonials found"});
        }
        res.json(testimonials);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getSingleTestimonials = async (req, res) => {
    try{
        const testimonial = await Testimonials.findById(req.params.id);
        if(!testimonial){
          return  res.status(404).json({message: "no such testimonial exists"});
        }
        res.json(testimonial);
    } catch (error){
        res.status(500).json({message: error.message});
    }
};

exports.updateTestimonials = async( req, res) => {
    try{
        const {quote, author} = req.body;
        if(!quote || !author){
          return  res.status(400).json({message: "required fields are empty"});
        }
        const updated = await Testimonials.findByIdAndUpdate(req.params.id, {
            quote,
            author
        },{new: true});
        if(!updated){
           return res.status(404).json({message: "Testimonials not found"});
        }
        res.json({message: "Testimonials has updated", data: updated});
    } catch (error) {
         res.status(500).json({message: error.message});
    }
};

exports.deleteTestimonials = async (req, res) => {
    try {
        const deleted = await Testimonials.findByIdAndDelete(req.params.id);
        if(!deleted){
           return res.status(404).json({message: "Testimonials not found"});
        }
        res.json({message: "testimonials has deleted"});
    } catch (error) {
         res.status(500).json({message: error.message});
    }
};