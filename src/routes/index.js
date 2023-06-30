const router = require("express").Router();

// Routes
const authRoutes = require("./auth");
const profileRoutes = require("./profile");
const connectionRoutes = require("./connections");

router.use("/auth", authRoutes);
router.use("/profile", profileRoutes);
router.use("/connections", connectionRoutes);

module.exports = router;
