import * as Joi from 'joi';

export const identifySchema = Joi.object({
  body: Joi.object({
    email: Joi.string().empty(null).allow(null).optional().email(),
    phoneNumber: Joi.number().empty(null).allow(null).optional(),
  }),
});
