const { Joi } = require("celebrate");

const createUserSchema = Joi.object().keys({
  name: Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string().required(),
  city: Joi.string().required(),
  type: Joi.string().required(),
  gender: Joi.string().required(),
  birthdate: Joi.string(),
});

const loginSchema = Joi.object().keys({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

module.exports = {
  createUserSchema,
  loginSchema
};
