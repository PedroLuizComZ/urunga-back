const { Joi } = require("celebrate");

const checkinSchema = Joi.object().keys({
  userId: Joi.string().required(),
  storeId: Joi.string().required(),
});

module.exports = {
  checkinSchema,
};
