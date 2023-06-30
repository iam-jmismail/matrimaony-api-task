const generate_uuid = require("uuid");
const jwt = require("jsonwebtoken");

// Models
const OtpQueueModel = require("../models/otp-queue");

// Helpers
const { generateOtp } = require("../helpers/generate-otp");

const sendOTP = async (req, res, next) => {
  const { mobile_no } = req.body;

  try {
    const otp = generateOtp();
    const uuid = generate_uuid.v4();

    // Create new otp request
    await OtpQueueModel.create({
      otp,
      uuid,
      mobile_no,
    });

    // OTP should be send using SMS or Email using any third party providers here

    // Create a temp profile with the number

    return res.status(200).send({
      status: "success",
      message: "Otp send success",
      uuid,
    });
  } catch (error) {
    // Forward error to global error handler
    return next(error);
  }
};
const verifyOTP = async (req, res, next) => {
  const { uuid, otp } = req.body;

  try {
    // Find OTP Record
    const otp_record = await OtpQueueModel.findOne({
      otp,
      uuid,
    });

    // Invalid OTP
    if (!otp_record)
      return res.status(209).send({
        status: "failed",
        message: "Invalid OTP",
      });

    // Check OTP Expired
    const epoch_time = Math.floor(new Date() / 1000);

    if (epoch_time > otp_record.expires_on)
      return res.status(410).send({
        status: "failed",
        message: "OTP Expired",
      });

    // Set OTP as verified
    await OtpQueueModel.updateOne(
      {
        uuid,
      },
      {
        $set: {
          is_verified: true,
        },
      }
    );

    // Create a Token with for the verified
    const payload = {
      mobile_no: otp_record.mobile_no,
    };

    jwt.sign(payload, process.env.JWTSecretKey, (error, token) => {
      if (error) throw error;
      return res.status(200).send({
        status: "success",
        message: "Otp verified success",
        token,
      });
    });
  } catch (error) {
    // Forward error to global error handler
    return next(error);
  }
};

module.exports = { sendOTP, verifyOTP };
