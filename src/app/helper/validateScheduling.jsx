import Joi from "joi";

const joiApplianceScheduleSchema = Joi.object({
  name: Joi.string()
    .valid(
      "Annually",
      "Monthly",
      "Weekly",
      "Quarterly",
      "Once a Year",
      "Spring & Fall"
    )
    .required(),
  start: Joi.date().required(),
  end: Joi.date().greater(Joi.ref("start")).required(),
  applianceId: Joi.string().required(),
  propertyId: Joi.string().required(),
});

export function validateApplianceSchedule(data) {
  return joiApplianceScheduleSchema.validate(data);
}
