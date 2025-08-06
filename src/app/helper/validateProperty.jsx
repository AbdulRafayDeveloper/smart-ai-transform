import Joi from "joi";

const joiPropertySchema = Joi.object({
  color: Joi.string().required(),
  name: Joi.string().required(),
  address: Joi.string().required(),
  purchaseDate: Joi.date().required(),
  propertyPrice: Joi.number().required(),
  yearBuilt: Joi.number().required(),
  interestRate: Joi.number().required(),
  squareFeet: Joi.number().required(),
  image: Joi.string().allow(null),
  subscriberId: Joi.string().required(),
});

export function validateProperty(data) {
  return joiPropertySchema.validate(data);
}
