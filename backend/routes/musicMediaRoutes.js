const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload')

const{
    getAllMedia,
    getSingleMedia,
    createMedia,
    updateMedia,
    deleteMedia
} = require('../controllers/musicMediaController');

router.get('/', getAllMedia);
router.post('/', upload.single('image'), createMedia);
router.put('/:id', upload.single('image'), updateMedia);
router.get('/:id', getSingleMedia);
router.delete('/:id', deleteMedia);

module.exports = router;
