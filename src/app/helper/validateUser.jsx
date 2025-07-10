import Joi from "joi";

const userSchema = Joi.object({
  fullName: Joi.string()
    .min(3)
    .required()
    .messages({
      "string.empty": "fullName is required.",
      "string.min": "fullName must be at least 3 characters long.",
    }),

  email: Joi.string().email().required().messages({
    "string.email": "Please enter a valid email address.",
    "string.empty": "Email is required.",
  }),

  password: Joi.string()
    .min(8)
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*])"))
    .required()
    .messages({
      "string.pattern.base":
        "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*).",
      "string.min": "Password must be at least 8 characters long.",
      "string.empty": "Password is required.",
    }),

});

export function validateUser(data) {
  return userSchema.validate(data);
}
