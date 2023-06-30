const { body, query, header, param } = require("express-validator");

const profileValidator = {
  createProfile: [
    header("authorization").isString().notEmpty(),

    body("full_name").isString().notEmpty(),
    body("dob").isDate().notEmpty(),
    body("gender").isString().notEmpty().isIn(["male", "female"]),
    body("birth_star").isString().notEmpty(),

    body("mother_tongue").isString().notEmpty(),
    body("caste").isString().notEmpty(),
    body("religion").isString().notEmpty(),

    body("coordinates")
      .isArray({ min: 2, max: 2 })
      .notEmpty()
      .isFloat({ min: -180, max: 180 })
      .withMessage("Invalid coordinates"),
    body("email").isString().notEmpty().isEmail(),
    body("marital_status")
      .isString()
      .notEmpty()
      .isIn(["single", "married", "widowed", "divorced", "separated"]),

    body("height")
      .isArray({ min: 2, max: 2 })
      .notEmpty()
      .isNumeric({ min: 1, max: 12 }),
    body("is_physically_challenged").isBoolean(),

    body("job").isString().notEmpty(),
    body("profile_bio").isString().notEmpty(),
    body("education_degree").isString().notEmpty(),
    body("education_field").isString().notEmpty(),

    body("eating_habits").isString().notEmpty().isIn(["veg", "nonveg"]),
    body("drinking_habits")
      .isString()
      .notEmpty()
      .isIn(["none", "former", "occasional", "moderate", "heavy", "abstinent"]),
    body("smoking_habits")
      .isString()
      .notEmpty()
      .isIn(["none", "former", "occasional", "moderate", "heavy", "chain"]),
    body("ideology")
      .isString()
      .notEmpty()
      .isIn(["spiritual", "conservative", "liberal", "agnostic", "atheist"]),

    body("interest_hobbies").isArray(),

    body("show_full_name").isBoolean(),
    body("show_dob").isBoolean(),
    body("show_location").isBoolean(),
  ],
  matchingProfile: [
    query("type")
      .notEmpty()
      .isIn(["location", "job", "education", "interests", "new"]),
  ],
  getProfile: [param("user_id").notEmpty().isMongoId()],
};

module.exports = profileValidator;
