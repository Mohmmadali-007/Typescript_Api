import * as Joi from 'joi';

export const cityValidator = {
  list: {
    offset: Joi.number().allow(),
    limit: Joi.number().allow(),
    districtId: Joi.number().allow(),
  },
  add: {
    name: Joi.string().required(),
    districtId: Joi.number().required(),
    stateId: Joi.number().required(),
  },
  edit: {
    cityId: Joi.number().required(),
    name: Joi.string().allow(),
    status: Joi.string().allow(),
    districtId: Joi.number().allow(),
    stateId: Joi.number().allow(),
  },
};
