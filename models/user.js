//User Schema file

// require MongoDB ODM: mongoose
const mongoose = require("mongoose");

//defining userSchema: users
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true
    },
    profileImage: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

userSchema.methods.joiValidate = function(obj) {
  const Joi = require("joi");
  var schema = {
    name: Joi.string()
      .min(3)
      .max(30)
      .required(),
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .min(8)
      .required(),
    profileImage: Joi.string().required()
  };
  return Joi.validate(obj, schema);
};

//Exporting User Model
module.exports = mongoose.model("User", userSchema);
