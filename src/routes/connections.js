const router = require("express").Router();

// Validation
const validate = require("../middlewares/validate");
const connValidator = require("../validators/connections");

// Middleware
const authMiddleware = require("../middlewares/auth");

// Controllers
const {
  getConnections,
  createConnection,
  approveConnection,
} = require("../controllers/connections");

router.get("/", authMiddleware, getConnections);
router.post(
  "/create",
  connValidator.createConnection,
  validate,
  authMiddleware,
  createConnection
);

router.post(
  "/update",
  connValidator.approveConnection,
  validate,
  authMiddleware,
  approveConnection
);

module.exports = router;
