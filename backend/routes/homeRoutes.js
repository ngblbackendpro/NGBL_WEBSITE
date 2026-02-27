const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');

router.get('/', homeController.getHomeData);

router.put('/experience', homeController.updateExperience);
router.put('/projects', homeController.updateProjects);

router.post('/offices', homeController.addOffice);
router.put('/offices/:id', homeController.updateOffice);
router.delete('/offices/:id', homeController.deleteOffice);
router.put('/social', homeController.updateSocialLinks);
router.put("/company-info", homeController.updateCompanyInfo);

module.exports = router;
