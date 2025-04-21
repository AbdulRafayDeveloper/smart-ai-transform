import Joi from "joi";

const userSchema = Joi.object({
  username: Joi.string()
    .pattern(/^[A-Za-z]+$/)
    .min(3)
    .required()
    .messages({
      "string.pattern.base":
        "Username must only contain alphabets without numbers or special characters.",
      "string.empty": "Username is required.",
      "string.min": "Username must be at least 3 characters long.",
    }),

  email: Joi.string().email().required().messages({
    "string.email": "Please enter a valid email address.",
    "string.empty": "Email is required.",
  }),

  password: Joi.string().min(8).required().messages({
    "string.min": "Password must be at least 8 characters long.",
    "string.empty": "Password is required.",
  }),

  role: Joi.string()
    .valid("homeowner", "realtor", "mortgage")
    .required()
    .messages({
      "any.only": "Please select a valid role to create a account",
      "string.empty": "Role is required.",
    }),
});

export function validateUser(data) {
  return userSchema.validate(data);
}
