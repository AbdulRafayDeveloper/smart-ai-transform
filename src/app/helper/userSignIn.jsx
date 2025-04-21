import Joi from "joi";

const signInSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.base": "Email must be a string.",
      "string.email": "Please provide a valid email address.",
      "string.empty": "Email cannot be empty.",
      "any.required": "Email is required.",
    }),
  password: Joi.string().min(8).required().messages({
    "string.base": "Password must be a string.",
    "string.empty": "Password cannot be empty.",
    "string.min": "Password must be at least 8 characters long.",
    "any.required": "Password is required.",
  }),
});

export function userSignIn(data) {
  return signInSchema.validate(data);
}
