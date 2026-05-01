const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const {
    getAllPartners,
    getSinglePartner,
    createPatners,
    deletePartners
} = require('../controllers/musicPartnerController');
const { get } = require('./musicMediaRoutes');

router.get('/', getAllPartners);
router.post('/', upload.single('image'), createPatners);
router.get('/:id', getSinglePartner);
router.delete('/:id', deletePartners);

module.exports = router;