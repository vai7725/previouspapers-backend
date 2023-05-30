// packages
const express = require('express');
const router = express.Router();

// modules
const controller = require('../controllers/appController');
const mailer = require('../middleware/mailer');
const verifyUser = require('../middleware/verifyUser');
const auth = require('../middleware/auth');

// GET Requests
router.route('/fetchuniversities').get(controller.fetchUniversities);
router.route('/papers/:university').get(controller.paperProvider);
router.route('/contact-info').get(controller.fetchContactInfo);
router.route('/generateotp').get(auth.localVariables, controller.generateOTP);
router.route('/verifyotp').get(controller.verifyOTP);
router.route('/getuser').get(auth.authorize, controller.getUser);

// POST Requests
router.route('/contact').post(verifyUser, controller.userContact);
router.route('/adduniversity').post(controller.storeNewUniversityData);
router.route('/addpaper').post(controller.storeNewPaper);
router.route('/storecred').post(controller.storeUserCred);
router.route('/register').post(controller.registerUser);
router.route('/verifymail').post(mailer);
router.route('/login').post(verifyUser, controller.loginUser);
router.route('/resetpassword').post(verifyUser, controller.updatePassword);

// PUT Requests
router.route('/updatetraffic').put(controller.updateTrafficCount);

// Delete Requests
router.route('/delete/:infoId').delete(controller.deleteUserContactQueryInfo);

module.exports = router;
