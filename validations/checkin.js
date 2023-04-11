const { Joi } = require("celebrate");

const checkinSchema = Joi.object().keys({
  userId: Joi.string().required(),
  storeId: Joi.string().required(),
  promotionId: Joi.string().required(),
  checkinAt: Joi.string().required(),
});

module.exports = {
  checkinSchema,
};
