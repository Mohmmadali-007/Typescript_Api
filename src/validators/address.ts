import * as Joi from 'joi';

export const addressValidator = {
  add: {
    name: Joi.string(),
    addressLine1: Joi.string(),
    addressLine2: Joi.string(),
    road: Joi.string(),
    landmark: Joi.string(),
    mobile: Joi.string(),
    isDefault: Joi.bool(),
    label: Joi.string().valid('home', 'work', 'other'),
    latitude: Joi.number(),
    longitude: Joi.number(),
    areaId: Joi.number(),
  },
  edit: {
    addressId: Joi.number().required(),
    name: Joi.string(),
    addressLine1: Joi.string(),
    addressLine2: Joi.string(),
    road: Joi.string(),
    landmark: Joi.string(),
    mobile: Joi.string(),
    isDefault: Joi.bool(),
    label: Joi.string().valid('home', 'work', 'other'),
    latitude: Joi.number(),
    longitude: Joi.number(),
    areaId: Joi.number(),
    status: Joi.string().valid('active', 'inactive', 'removed'),
  },
  list: {
    offset: Joi.number().required(),
    limit: Joi.number().required(),
  },
};
