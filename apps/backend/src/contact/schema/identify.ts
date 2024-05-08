import * as Joi from 'joi';

export const identifySchema = Joi.object({
  body: Joi.object({
    email: Joi.string().optional().email(),
    phoneNumber: Joi.number().optional(),
  }),
});
