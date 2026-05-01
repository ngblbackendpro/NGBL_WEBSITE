const express = require('express');
const router = express.Router();

const{
    createMusicContact
} = require('../controllers/musicContactController');

router.post('/', createMusicContact);

module.exports = router;