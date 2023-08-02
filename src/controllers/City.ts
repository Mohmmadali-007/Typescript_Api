import { Request, Response, NextFunction } from 'express';
import { cityValidator } from '../validator/city';
import { validateRequestInput } from '../validator';
import constants from '../utils/constants';
import { sequelize } from '../db/db';

export default class City {
  constructor() {}

  async add(req: Request, res: Response, next: NextFunction) {
    try {
      const requestData = req.body;
      const validateRequest = validateRequestInput(cityValidator.add, requestData);
      if (!validateRequest.isValid) {
        return res.status(constants.CODES.VALIDATION_FAILED).send({
          success: false,
          message: constants.MESSAGES.GENERAL.VALIDATION_FAILED,
          data: validateRequest.error,
        });
      }

      const city: any[] = await sequelize.query(
        'CALL sp_city_add (:name, :districtId, :stateId);',
        {
          replacements: {
            name: requestData.name,
            districtId: requestData.districtId,
            stateId: requestData.stateId,
          },
        },
      );

      if (city[0].message === 'city already exists') {
        return res.status(constants.CODES.VALIDATION_FAILED).send({
          success: false,
          message: constants.MESSAGES.CITY.ALREADY_EXISTS,
        });
      } else {
        return res.status(constants.CODES.SUCCESS).send({
          success: true,
          data: constants.MESSAGES.CITY.CREATED,
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
      const validateRequest = validateRequestInput(cityValidator.list, requestData);
      if (!validateRequest.isValid) {
        return res.status(constants.CODES.VALIDATION_FAILED).send({
          success: false,
          message: constants.MESSAGES.GENERAL.VALIDATION_FAILED,
          data: validateRequest.error,
        });
      }

      const cities = await sequelize.query(
        `CALL sp_city_list(
              :offset,
              :limit,
              :districtId
              );`,
        {
          replacements: {
            offset: requestData.offset || null,
            limit: requestData.limit || null,
            districtId: requestData.districtId || null,
          },
        },
      );
      return res.status(constants.CODES.SUCCESS).send({
        success: true,
        data: cities,
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
      const validateRequest = validateRequestInput(cityValidator.edit, requestData);
      if (!validateRequest.isValid) {
        return res.status(constants.CODES.VALIDATION_FAILED).send({
          success: false,
          message: constants.MESSAGES.GENERAL.VALIDATION_FAILED,
          data: validateRequest.error,
        });
      }

      const city: any[] = await sequelize.query(
        `CALL sp_city_edit(
                :cityId,
                :name,
                :status,
                :districtId,
                :stateId
                );`,
        {
          replacements: {
            cityId: requestData.cityId,
            name: requestData.name || null,
            status: requestData.status || null,
            districtId: requestData.districtId || null,
            stateId: requestData.stateId || null,
          },
        },
      );

      if (city[0].message === 'city not found') {
        return res.status(constants.CODES.NOT_FOUND).send({
          success: false,
          message: constants.MESSAGES.CITY.DOES_NOT_EXIST,
        });
      } else if (city[0].message === 'city already exists') {
        return res.status(constants.CODES.VALIDATION_FAILED).send({
          success: false,
          message: constants.MESSAGES.CITY.ALREADY_EXISTS,
        });
      } else {
        return res.status(constants.CODES.SUCCESS).send({
          success: true,
          data: constants.MESSAGES.CITY.UPDATED,
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
