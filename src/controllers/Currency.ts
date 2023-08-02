import { Request, Response, NextFunction } from 'express';
import constants from '../utils/constants';
import { currencyValidator } from '../validator/currency';
import { validateRequestInput } from '../validator';
import { sequelize } from '../db/db';

export default class Currency {
  constructor() {}
  async add(req: Request, res: Response, next: NextFunction) {
    try {
      const requestData = req.body;
      const validateRequest = validateRequestInput(currencyValidator.add, requestData);
      if (!validateRequest.isValid) {
        return res.status(constants.CODES.VALIDATION_FAILED).send({
          success: false,
          message: constants.MESSAGES.GENERAL.VALIDATION_FAILED,
          data: validateRequest.error,
        });
      }

      await sequelize.query(
        `CALL sp_currency_add(
        :currencyName, 
        :currencyCode,
        :countryId);`,
        {
          replacements: {
            currencyName: requestData.name,
            currencyCode: requestData.code,
            countryId: requestData.countryId,
          },
        },
      );
      return res.status(constants.CODES.SUCCESS).send({
        success: true,
        message: constants.MESSAGES.CURRENCY.ADDED,
      });
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
      const validateRequest = validateRequestInput(currencyValidator.list, requestData);
      if (!validateRequest.isValid) {
        return res.status(constants.CODES.VALIDATION_FAILED).send({
          success: false,
          message: constants.MESSAGES.GENERAL.VALIDATION_FAILED,
          data: validateRequest.error,
        });
      }

      interface Replacements {
        offset: number | null;
        limit: number | null;
        name: string | null;
      }

      const replacements: Replacements = {
        offset: requestData.offset || null,
        limit: requestData.limit || null,
        name: requestData.name || null,
      };

      const currency = await sequelize.query(
        `CALL sp_currency_list(
          :offset, 
          :limit, 
          :languageName);`,
        {
          replacements: {
            offset: replacements.offset,
            limit: replacements.limit,
            languageName: replacements.name,
          },
        },
      );
      return res.status(constants.CODES.SUCCESS).send({
        success: true,
        data: currency,
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
      const validateRequest = validateRequestInput(currencyValidator.edit, requestData);
      if (!validateRequest.isValid) {
        return res.status(constants.CODES.VALIDATION_FAILED).send({
          success: false,
          message: constants.MESSAGES.GENERAL.VALIDATION_FAILED,
          data: validateRequest.error,
        });
      }

      interface Replacements {
        currencyId: number;
        currencyName: string | null;
        currencyCode: string | null;
        currencyStatus: string | null;
      }

      const replacements: Replacements = {
        currencyId: requestData.currencyId,
        currencyName: requestData.name || null,
        currencyCode: requestData.code || null,
        currencyStatus: requestData.status || null,
      };

      if (requestData.status === false || requestData.status === true) {
        replacements.currencyStatus = requestData.status;
      }

      await sequelize.query(
        `CALL sp_currency_edit(
          :currencyId, 
          :currencyName, 
          :currencyCode, 
          :currencyStatus)`,
        {
          replacements: {
            currencyId: replacements.currencyId,
            currencyName: replacements.currencyName,
            currencyCode: replacements.currencyCode,
            currencyStatus: replacements.currencyStatus,
          },
        },
      );
      return res.status(constants.CODES.SUCCESS).send({
        success: true,
        message: constants.MESSAGES.CURRENCY.UPDATED,
      });
    } catch (error: any) {
      console.log(error);
      return res.status(constants.CODES.SOMETHING_WENT_WRONG).send({
        success: false,
        message: error.message,
      });
    }
  }
}
