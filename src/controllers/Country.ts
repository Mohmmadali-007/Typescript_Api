import { Request, Response, NextFunction } from 'express';
import { countryValidator } from '../validator/country';
import { validateRequestInput } from '../validator';
import constants from '../utils/constants';
import { sequelize } from '../db/db';

export default class Country {
  constructor() {}

  async add(req: Request, res: Response, next: NextFunction) {
    try {
      const requestData = req.body;
      const validateRequest = validateRequestInput(countryValidator.add, requestData);
      if (!validateRequest.isValid) {
        return res.status(constants.CODES.VALIDATION_FAILED).send({
          success: false,
          message: constants.MESSAGES.GENERAL.VALIDATION_FAILED,
          data: validateRequest.error,
        });
      }

      const country: any[] = await sequelize.query('CALL sp_country_add(:name);', {
        replacements: {
          name: requestData.name,
        },
      });

      if (country[0].message === 'country already exists') {
        return res.status(constants.CODES.VALIDATION_FAILED).send({
          success: false,
          message: constants.MESSAGES.COUNTRY.ALREADY_EXISTS,
        });
      } else {
        return res.status(constants.CODES.SUCCESS).send({
          success: true,
          data: constants.MESSAGES.COUNTRY.CREATED,
        });
      }
    } catch (error: any) {
      console.log(error);
      return res.status(constants.CODES.SOMETHING_WENT_WRONG).send({
        success: false,
        message: error.message,
      });
    }
  }

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const requestData = req.body;
      const validateRequest = validateRequestInput(countryValidator.list, requestData);
      if (!validateRequest.isValid) {
        return res.status(constants.CODES.VALIDATION_FAILED).send({
          success: false,
          message: constants.MESSAGES.GENERAL.VALIDATION_FAILED,
          data: validateRequest.error,
        });
      }

      const countries = await sequelize.query(
        `CALL sp_country_list(
              :offset,
              :limit,
              :name
              );`,
        {
          replacements: {
            offset: requestData.offset || null,
            limit: requestData.limit || null,
            name: requestData.name || null,
          },
        },
      );
      return res.status(constants.CODES.SUCCESS).send({
        success: true,
        data: countries,
      });
    } catch (error: any) {
      console.log(error);
      return res.status(constants.CODES.SOMETHING_WENT_WRONG).send({
        success: false,
        message: error.message,
      });
    }
  }

  async edit(req: Request, res: Response, next: NextFunction) {
    try {
      const requestData = req.body;
      const validateRequest = validateRequestInput(countryValidator.edit, requestData);
      if (!validateRequest.isValid) {
        return res.status(constants.CODES.VALIDATION_FAILED).send({
          success: false,
          message: constants.MESSAGES.GENERAL.VALIDATION_FAILED,
          data: validateRequest.error,
        });
      }

      const country: any[] = await sequelize.query(
        `CALL sp_country_edit(
              :countryId,
              :name,
              :status
              );`,
        {
          replacements: {
            countryId: requestData.countryId,
            name: requestData.name || null,
            status: requestData.status || null,
          },
        },
      );

      if (country[0].message === 'country not found') {
        return res.status(constants.CODES.NOT_FOUND).send({
          success: false,
          message: constants.MESSAGES.COUNTRY.DOES_NOT_EXIST,
        });
      } else if (country[0].message === 'country already exists.') {
        return res.status(constants.CODES.VALIDATION_FAILED).send({
          success: false,
          message: constants.MESSAGES.COUNTRY.ALREADY_EXISTS,
        });
      } else {
        return res.status(constants.CODES.SUCCESS).send({
          success: true,
          data: constants.MESSAGES.COUNTRY.UPDATED,
        });
      }
    } catch (error: any) {
      console.log(error);
      return res.status(constants.CODES.SOMETHING_WENT_WRONG).send({
        success: false,
        message: error.message,
      });
    }
  }
}
