const { validationResult } = require('express-validator');

const validate = (req , res , next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  const extractedErrors = errors.array().map((err) => {
    const { path, msg } = err;
    return { [path]: msg };
  });

  const noDuplicates = [...new Map(extractedErrors.map(item => [JSON.stringify(item), item])).values()]

  return res.status(422).send(noDuplicates);
};

module.exports = validate;