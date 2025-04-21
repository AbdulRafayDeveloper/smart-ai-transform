import Joi from "joi";

const joiPackagesSchema = Joi.object({
  name: Joi.string().valid("basic", "advance", "premium").required(),
  price: Joi.number().required(),
  property_included: Joi.number().required(),
  payment_type: Joi.string().allow(null),
});

export function validatePackage(data) {
  return joiPackagesSchema.validate(data);
}
