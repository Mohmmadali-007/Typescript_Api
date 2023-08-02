import * as Joi from 'joi';

export const currencyValidator = {
  add: {
    name: Joi.string().required(),
    code: Joi.string().required(),
    countryId: Joi.number().required(),
  },
  list: {
    name: Joi.string().allow(),
    offset: Joi.number().allow(),
    limit: Joi.number().allow(),
  },
  edit: {
    currencyId: Joi.number().required(),
    name: Joi.string().allow(),
    code: Joi.string().allow(),
    status: Joi.string().allow(),
  },
};
