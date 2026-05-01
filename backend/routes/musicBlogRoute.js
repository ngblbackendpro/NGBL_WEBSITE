const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');

const {
    createMusicBlog,
    getMusicBlog,
    deleteMusicBlog,
    getSingleMusicBlog,
    updateMusicBlog
} = require('../controllers/musicBlogController');


router.get('/', getMusicBlog);
router.post('/', upload.single("musicImg"), createMusicBlog);
router.get('/:id', getSingleMusicBlog);
router.delete('/:id', deleteMusicBlog);
router.put('/:id', upload.single('musicImg'), updateMusicBlog);

module.exports = router;