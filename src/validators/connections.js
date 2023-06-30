const { body } = require("express-validator");

const connValidators = {
  createConnection: [body("user_id").isMongoId().notEmpty()],
  approveConnection: [
    body("conn_id").isMongoId().notEmpty(),
    body("status").isString().notEmpty().isIn(["Approved", "Rejected"]),
  ],
};

module.exports = connValidators;
