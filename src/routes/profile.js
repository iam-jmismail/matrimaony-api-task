const router = require("express").Router();

// Validation
const validate = require("../middlewares/validate");
const profileValidator = require("../validators/profile");

// Middleware
const authMiddleware = require("../middlewares/auth");

// Controllers
const {
  createProfile,
  getBasicProfile,
  getMatchingProfiles,
  getProfile,
} = require("../controllers/profile");

router.post("/create", profileValidator.createProfile, validate, createProfile);
router.get("/basic", getBasicProfile);
router.get(
  "/matches",
  profileValidator.matchingProfile,
  validate,
  authMiddleware,
  getMatchingProfiles
);
router.get(
  "/:user_id",
  profileValidator.getProfile,
  validate,
  authMiddleware,
  getProfile
);

module.exports = router;
