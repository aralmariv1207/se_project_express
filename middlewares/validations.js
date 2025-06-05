const { celebrate, Joi } = require("celebrate");

const validateSignup = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().required().min(2).max(30),
    age: Joi.number().integer().required().min(18),
    about: Joi.string().min(2).max(30),
  }),
});

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const validateItem = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    imageUrl: Joi.string().required().uri(),
    description: Joi.string().required().min(2).max(200),
    category: Joi.string()
      .required()
      .valid("clothing", "accessories", "footwear"),
  }),
});

exports.validateSignup = validateSignup;
exports.validateLogin = validateLogin;
exports.validateItem = validateItem;
exports.celebrate = celebrate; // Export celebrate for use in other files if needed
