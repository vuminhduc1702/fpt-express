const Joi = require("joi");

const registerValidator = (data) => {
  const rule = Joi.object({
    username: Joi.string().min(5).max(255).required(),
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(20).required(),
  });

  return rule.validate(data);
};

module.exports.registerValidator = registerValidator;
