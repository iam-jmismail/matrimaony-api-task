const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token)
    return res.status(401).send({
      message: "Token is required",
    });

  jwt.verify(token, process.env.JWTSecretKey, (err, payload) => {
    if (err)
      return res.status(401).send({
        message: "Invalid token",
      });

    req.user = payload;
    next();
  });
};

module.exports = authMiddleware;
