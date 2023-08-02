import * as Joi from 'joi';

export const categoryValidator = {
  add: {
    companyId: Joi.number().allow(),
    categoryLanguages: Joi.array()
      .allow()
      .items(
        Joi.object({
          languageId: Joi.number().required(),
          categoryName: Joi.string().required(),
        }),
      ),
  },
  list: {
    ids: Joi.array().allow(),
    name: Joi.string().allow(),
    offset: Joi.number().allow(),
    limit: Joi.number().allow(),
  },
  edit: {
    categoryId: Joi.number().required(),
    companyId: Joi.number().allow(),
    categoryLanguages: Joi.array()
      .allow()
      .items(
        Joi.object({
          languageId: Joi.number().required(),
          categoryName: Joi.string().required(),
          status: Joi.string().required(),
        }),
      ),
    status: Joi.string().required(),
  },
};
