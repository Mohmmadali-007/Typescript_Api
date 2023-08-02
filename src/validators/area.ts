import * as Joi from 'joi';

export const areaValidator = {
  list: {
    offset: Joi.number().allow(),
    limit: Joi.number().allow(),
    cityId: Joi.number().allow(),
  },
  add: {
    code: Joi.string().required(),
    name: Joi.string().required(),
    cityId: Joi.number().required(),
  },
  edit: {
    areaId: Joi.number().required(),
    code: Joi.string().allow(),
    name: Joi.string().allow(),
    status: Joi.string().allow(),
    cityId: Joi.number().allow(),
  },
};
