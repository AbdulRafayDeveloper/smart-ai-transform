import Joi from "joi";

const joiContractorSchema = Joi.object({
  contractorType: Joi.string()
    .valid(
      "Insurance agent",
      "Mortgage company",
      "Real estate agent",
      "Electrician",
      "Handyman",
      "House cleaner",
      "HVAC company",
      "Pest control",
      "Plumber",
      "Pool maintenance",
      "Power washer",
      "Window washer",
      "Yard maintenance",
      "Cable company",
      "Electric company",
      "Gas company",
      "Internet company",
      "Recycling service",
      "Trash service"
    )
    .required(),
  companyName: Joi.string().trim().required(),
  phoneNo: Joi.string()
    .trim()
    .pattern(/^\+?[1-9]\d{1,14}$/)
    .required(),
  companyWebsite: Joi.string().trim().uri().allow(""),
  contractorEmail: Joi.string().trim().email().required(),
  amount: Joi.number().min(0).required(),
  additionalNotes: Joi.string().trim().allow(""),
});

export function validateContractor(data) {
  return joiContractorSchema.validate(data);
}
