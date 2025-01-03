const express = require("express");
const otpController = require("../controllers/otpController")

const router = express.Router() 

router.post('/generate', otpController.generateOTP)
router.post('/validate', otpController.validateOTP)

module.exports = router