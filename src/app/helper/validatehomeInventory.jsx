import Joi from "joi";

const joiHomeInventorySchema = Joi.object({
  roomNo: Joi.number().required(),
  brand: Joi.string().trim().required(),
  dateCompleted: Joi.date().required(),
  contractorName: Joi.string().trim().required(),
  color: Joi.string().trim().required(),
  additionalNotes: Joi.string().trim().allow(""),
  propertyId: Joi.string().required(),
  contractorId: Joi.string().allow(null, ""),
  name: Joi.string().trim().required(),
});

export function validateHomeInventory(data) {
  return joiHomeInventorySchema.validate(data);
}
