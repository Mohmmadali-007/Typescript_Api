import * as Joi from 'joi';

export const validateRequestInput = (schema, object) => {
  const isValid = Joi.object().keys(schema).validate(object);
  // eslint-disable-next-line no-prototype-builtins
  if (isValid.hasOwnProperty('error')) {
    return { isValid: false, error: isValid.error };
  }
  return { isValid: true, error: null };
};
