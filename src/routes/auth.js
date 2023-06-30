
const router = require('express').Router()

// Validation
const validate = require('../middlewares/validate')
const authValidator = require('../validators/auth')

// Controllers 
const { sendOTP, verifyOTP } = require('../controllers/auth');

router.post('/send-otp', authValidator.sendOTP, validate, sendOTP)
router.post('/verify-otp', authValidator.verifyOTP, validate, verifyOTP)

module.exports = router;