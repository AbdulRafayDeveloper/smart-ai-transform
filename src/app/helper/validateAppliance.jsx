import Joi from "joi";

const phonePattern = /^[0-9]{7,15}$/; // allows 7 to 15 digit numbers
const urlPattern = /^(https?:\/\/)?[\w.-]+\.[a-z]{2,}(\/\S*)?$/i;

const joiApplianceSchema = Joi.object({
  applianceName: Joi.string().trim().required().messages({
    "string.empty": "Appliance Name is required.",
  }),

  applianceType: Joi.string().trim().required().messages({
    "string.empty": "Appliance type is required.",
  }),

  brand: Joi.string().trim().required().messages({
    "string.empty": "Brand is required.",
  }),

  serialNumber: Joi.string().trim().required().messages({
    "string.empty": "Serial number is required.",
  }),

  image: Joi.string().uri().allow("").optional().messages({
    "string.uri": "Image must be a valid URL.",
  }),

  modelNumber: Joi.string().trim().required().messages({
    "string.empty": "Model number is required.",
  }),

  maintenanceStatus: Joi.string()
    .valid("Good", "Upcoming Maintenance", "Urgent Repair")
    .required()
    .messages({
      "any.only":
        "Maintenance status must be one of: Good, Upcoming Maintenance, Urgent Repair.",
    }),

  propertyId: Joi.string().required().messages({
    "any.required": "Property ID is missing.",
  }),

  purchasedFrom: Joi.object({
    companyName: Joi.string().trim().required().messages({
      "string.empty": "Purchased From: Company name is required.",
    }),

    contactName: Joi.string().trim().required().messages({
      "string.empty": "Purchased From: Contact name is required.",
    }),

    phone: Joi.string().pattern(phonePattern).required().messages({
      "string.pattern.base":
        "Purchased From: Phone must be a valid number (7-15 digits).",
      "string.empty": "Purchased From: Phone number is required.",
    }),

    email: Joi.string().email().required().messages({
      "string.email": "Purchased From: Email must be valid.",
      "string.empty": "Purchased From: Email is required.",
    }),

    warrantyExpires: Joi.date().required().messages({
      "date.base": "Purchased From: Warranty expiry must be a valid date.",
      "any.required": "Purchased From: Warranty expiry is required.",
    }),

    purchaseDate: Joi.date().required().messages({
      "date.base": "Purchased From: Purchase date must be valid.",
    }),

    website: Joi.string().pattern(urlPattern).allow("").optional().messages({
      "string.pattern.base": "Purchased From: Website must be a valid URL.",
    }),
  }).required(),

  installedBy: Joi.object({
    companyName: Joi.string().trim().required().messages({
      "string.empty": "Installed By: Company name is required.",
    }),

    contactName: Joi.string().trim().required().messages({
      "string.empty": "Installed By: Contact name is required.",
    }),

    phone: Joi.string().pattern(phonePattern).required().messages({
      "string.pattern.base":
        "Installed By: Phone must be a valid number (7–15 digits).",
    }),

    contractorId: Joi.string().optional(),

    email: Joi.string().email().required().messages({
      "string.email": "Installed By: Email must be valid.",
    }),

    lastServiced: Joi.date().optional().messages({
      "date.base": "Installed By: Last serviced must be a valid date.",
    }),

    purchaseDate: Joi.date().required().messages({
      "any.required": "Installed By: Purchase date is required.",
    }),

    website: Joi.string().pattern(urlPattern).allow("").optional().messages({
      "string.pattern.base": "Installed By: Website must be a valid URL.",
    }),

    installationDate: Joi.date().required().messages({
      "any.required": "Installed By: Installation date is required.",
    }),
  }).required(),

  purchasedBy: Joi.object({
    companyName: Joi.string().trim().required().messages({
      "string.empty": "Purchased By: Company name is required.",
    }),

    contactName: Joi.string().trim().required().messages({
      "string.empty": "Purchased By: Contact name is required.",
    }),

    phone: Joi.string().pattern(phonePattern).required().messages({
      "string.pattern.base":
        "Purchased By: Phone must be a valid number (7–15 digits).",
    }),

    purchaseDate: Joi.date().required().messages({
      "any.required": "Purchased By: Purchase date is required.",
    }),

    website: Joi.string().pattern(urlPattern).allow("").optional().messages({
      "string.pattern.base": "Purchased By: Website must be a valid URL.",
    }),
  }).required(),

  additionalNotes: Joi.string().allow("").optional().messages({
    "string.base": "Additional notes must be text.",
  }),
});

export function validateAppliance(data) {
  return joiApplianceSchema.validate(data, { abortEarly: false });
}
