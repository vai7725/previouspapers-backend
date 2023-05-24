// packages
const express = require('express');
const router = express.Router();

// modules
const controller = require('../controllers/appController');

// GET Requests
router.route('/fetchuniversities').get(controller.fetchUniversities);
router.route('/papers/:university').get(controller.paperProvider);
router.route('/contact-info').get(controller.fetchContactInfo);

// POST Requests
router.route('/contact').post(controller.userContact);
router.route('/adduniversity').post(controller.storeNewUniversityData);
router.route('/addpaper').post(controller.storeNewPaper);

// PUT Requests
router.route('/updatetraffic').put(controller.updateTrafficCount);

// Delete Requests
router.route('/delete/:infoId').delete(controller.deleteUserContactQueryInfo);

module.exports = router;
