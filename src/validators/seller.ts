import * as Joi from 'joi';

export const sellerValidator = {
  add: {
    domainId: Joi.number().required(),
    name: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().required(),
    password: Joi.string().required(),
    address: Joi.string().required(),
    cityId: Joi.number(),
    companyIds: Joi.array().items(Joi.number().integer()).allow(),
  },
  edit: {
    sellerId: Joi.number().required(),
    name: Joi.string(),
    address: Joi.string(),
    cityId: Joi.number(),
    password: Joi.string().allow(),
  },
  login: {
    email: Joi.string().required(),
    password: Joi.string().required(),
    domainId: Joi.number().required(),
  },
  list: {
    offset: Joi.number(),
    limit: Joi.number(),
    sellerId: Joi.number(),
    email: Joi.string(),
    phone: Joi.string(),
  },
};
