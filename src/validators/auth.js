const { body } = require("express-validator");

const authValidators = {
    sendOTP: [
        body('mobile_no').isMobilePhone().withMessage('Invalid Number'),
    ],
    verifyOTP: [
        body('otp').isNumeric().isLength({ min: 6, max: 6 }).withMessage('Invalid Otp'),
        body('uuid').isUUID().withMessage('Invalid Token'),
    ]
}

module.exports = authValidators