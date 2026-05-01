const express = require('express');
const router = express.Router();

const{
    createMusicCompliance,
    getAllSections,
    getSectionKey,
    updateSections,
    deleteSection
} = require('../controllers/musicComplianceController');

router.post('/', createMusicCompliance);
router.get('/', getAllSections);
router.put('/:key', updateSections);
router.get('/:key', getSectionKey);
router.delete('/:key', deleteSection);

module.exports = router;
