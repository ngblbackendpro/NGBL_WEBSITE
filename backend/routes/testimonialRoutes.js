const express = require('express');
const router = express.Router();

const{
    getAllTestimonials,
    getSingleTestimonials,
    createTestimonials,
    updateTestimonials,
    deleteTestimonials
} = require('../controllers/testimonialsController');

router.get('/', getAllTestimonials);
router.get('/:id', getSingleTestimonials);
router.post('/', createTestimonials);
router.put('/:id', updateTestimonials);
router.delete('/:id', deleteTestimonials);

module.exports = router;