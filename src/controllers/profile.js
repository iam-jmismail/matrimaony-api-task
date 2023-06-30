const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

// Models
const ProfileModel = require("../models/profile");

const createProfile = async (req, res, next) => {
  const {
    body: {
      full_name,
      gender,
      dob,
      mother_tongue,
      religion,
      coordinates,
      email,
      marital_status,
      height,
      caste,
      birth_star,
      is_physically_challenged,
      education_degree,
      education_field,
      job,
      profile_bio,
      eating_habits,
      drinking_habits,
      smoking_habits,
      ideology,
      interest_hobbies,
      show_full_name,
      show_dob,
      show_location,
      references,
    },
    headers: { authorization },
  } = req;

  try {
    jwt.verify(
      authorization,
      process.env.JWTSecretKey,
      async (error, payload) => {
        if (error) throw Error("Invalid Token");

        const profile_data = {
          full_name,
          gender,
          dob,
          mother_tongue,
          religion,
          location: {
            type: "Point",
            coordinates,
          },
          email,
          mobile: payload.mobile_no,
          marital_status,
          height: { feet: height[0], inches: height[1] },
          caste,
          birth_star,
          is_physically_challenged,
          education: {
            degree: education_degree,
            field: education_field,
          },
          job,
          profile_bio,
          eating_habits,
          drinking_habits,
          smoking_habits,
          ideology,
          interest_hobbies,
          preferences: {
            show_full_name,
            show_dob,
            show_location,
          },
          references,
        };

        const user = await ProfileModel.create(profile_data);

        const access_token_payload = {
          id: user._id,
          full_name: user.full_name,
        };

        jwt.sign(
          access_token_payload,
          process.env.JWTSecretKey,
          (error, token) => {
            if (error) throw new Error(error);
            return res.status(200).send({ status: "success", token });
          }
        );
      }
    );
  } catch (error) {
    // Forward error to global error handler
    return next(error);
  }
};

const getBasicProfile = async (req, res, next) => {
  // Get User Id through login
  const userId = "649dbe725875115c4318d338";

  try {
    const profile = await ProfileModel.findOne({
      _id: new mongoose.mongo.ObjectId(userId),
    }).select("full_name is_email_verified is_id_proof_verified");

    return res.status(200).send(profile);
  } catch (error) {
    // Forward error to global error handler
    return next(error);
  }
};

const getMatchingProfiles = async (req, res, next) => {
  const {
    query: { type },
    user: { id: userId },
  } = req;

  try {
    const select_fields = "location job education interest_hobbies";
    let query_conditions = {};

    const ref_user = await ProfileModel.findOne({
      _id: new mongoose.mongo.ObjectId(userId),
    }).select(select_fields);

    const looking_for = ref_user.gender === "male" ? "female" : "male";

    switch (type) {
      case "job":
        query_conditions = {
          job: ref_user.job,
        };
        break;

      case "education":
        query_conditions = {
          "education.degree": ref_user.education.degree,
          "education.field": ref_user.education.field,
        };
        break;

      case "interests":
        query_conditions = {
          interest_hobbies: {
            $in: [...ref_user.interest_hobbies],
          },
        };
        break;

      case "new":
        const currentDate = new Date();
        const pastDate = new Date();
        pastDate.setDate(currentDate.getDate() - 7); // Subtract 7 days

        query_conditions = {
          created_at: {
            $gt: pastDate,
          },
        };
    }

    // For Geospatial Reference
    const [latitude, longitude] = ref_user.location.coordinates;

    // Alter Looking For conditions
    query_conditions = {
      ...query_conditions,
      gender: looking_for, // gender
      _id: { $not: { $eq: new mongoose.mongo.ObjectId(userId) } },
    };

    // Final Result Object after projection
    const result_object = {
      name: {
        $cond: {
          if: { $eq: ["$preferences.show_full_name", true] },
          then: "$full_name",
          else: "Name Locked",
        },
      },
      age: {
        $concat: [
          {
            $toString: {
              $round: [
                {
                  $divide: [
                    { $subtract: [new Date(), "$dob"] },
                    { $multiply: [365 * 24 * 60 * 60 * 1000] }, // Milliseconds in a year
                  ],
                },
                0,
              ],
            },
          },
          " yrs",
        ],
      },
      height: {
        $concat: [
          { $toString: "$height.feet" },
          "ft ",
          { $toString: "$height.inches" },
          "in",
        ],
      },
      job: 1,
    };

    const profiles =
      type === "location"
        ? await ProfileModel.aggregate([
            {
              $geoNear: {
                near: {
                  type: "Point",
                  coordinates: [latitude, longitude],
                },
                distanceField: "distance",
                maxDistance: 5 * 1000,
                minDistance: 0,
                spherical: true,
              },
            },
            {
              $match: {
                gender: looking_for,
                _id: { $not: { $eq: new mongoose.mongo.ObjectId(userId) } },
              },
            },
            {
              $project: result_object,
            },
          ])
        : await ProfileModel.aggregate([
            {
              $match: query_conditions,
            },
            {
              $project: result_object,
            },
          ]);

    return res.status(200).send(profiles);
  } catch (error) {
    // Forward error to global error handler
    return next(error);
  }
};

const getProfile = async function (req, res, next) {
  const { user_id } = req.params;
  try {
    const result_object = {
      name: {
        $cond: {
          if: { $eq: ["$preferences.show_full_name", true] },
          then: "$full_name",
          else: "Name Locked",
        },
      },
      dob: {
        $cond: {
          if: { $eq: ["$preferences.show_dob", true] },
          then: "$dob",
          else: "Dob locked",
        },
      },
      location: {
        $cond: {
          if: { $eq: ["$preferences.show_location", true] },
          then: "$location.coordinates",
          else: "Location locked",
        },
      },
      age: {
        $concat: [
          {
            $toString: {
              $round: [
                {
                  $divide: [
                    { $subtract: [new Date(), "$dob"] },
                    { $multiply: [365 * 24 * 60 * 60 * 1000] }, // Milliseconds in a year
                  ],
                },
                0,
              ],
            },
          },
          " yrs",
        ],
      },
      height: {
        $concat: [
          { $toString: "$height.feet" },
          "ft ",
          { $toString: "$height.inches" },
          "in",
        ],
      },
      job: 1,
      mother_tongue: 1,
      religion: 1,
      caste: 1,
      email: 1,
      birth_star: 1,
      is_physically_challenged: 1,
      education: {
        $concat: [
          { $toString: "$education.degree" },
          " ",
          { $toString: "$education.field" },
        ],
      },
      profile_bio: 1,
      food_habits: 1,
      smoking_habits: 1,
      drinking_habits: 1,
      ideology: 1,
      interest_hobbies: 1,
    };
    const profiles = await ProfileModel.aggregate([
      {
        $match: {
          _id: new mongoose.mongo.ObjectId(user_id),
          is_deleted: false,
        },
      },
      { $project: result_object },
    ]);

    if (profiles.length === 0)
      return res.status(404).send({
        status: "failed",
        message: "Profile Not Found",
      });

    const [profile] = profiles;
    return res.status(200).send({
      status: "success",
      result: profile,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createProfile,
  getBasicProfile,
  getMatchingProfiles,
  getProfile,
};
