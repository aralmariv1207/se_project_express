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

const validateUserProfile = celebrate({
  body: Joi.object()
    .keys({
      name: Joi.string().min(2).max(30),
      avatar: Joi.string().uri(),
    })
    .or("name", "avatar"),
});

exports.validateSignup = validateSignup;
exports.validateLogin = validateLogin;
exports.validateItem = validateItem;
exports.validateUserProfile = validateUserProfile;
exports.celebrate = celebrate; // Export celebrate for use in routes
