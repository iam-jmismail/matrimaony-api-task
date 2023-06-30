const mongoose = require('mongoose');
// const getSchemaTimeStamps  = require('./common')
const { addMinutesToCurrentTime } = require('../helpers/time')


const otpSchema = new mongoose.Schema({

    otp: {
        type: Number,
        required: true
    },

    uuid: {
        type: String,
        required: true
    },

    is_verified: {
        type: Boolean,
        required: true,
        default: false
    },

    mobile_no: {
        type: Number,
        required: true,
    },

    expires_on: {
        type: Number,
        require: true,
        default: addMinutesToCurrentTime() // Current Plus 3 minutes
    }

}, {
    timestamps: {
        createdAt: 'created_at', updatedAt: 'updated_at'
    }
})


module.exports = mongoose.model('otp-queue', otpSchema);