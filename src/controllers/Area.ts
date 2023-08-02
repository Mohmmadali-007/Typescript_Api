import { Request, Response, NextFunction } from 'express';
import { areaValidator } from '../validator/area';
import { validateRequestInput } from '../validator';
import constants from '../utils/constants';
import { sequelize } from '../db/db';

export default class Area {
  constructor() {}

  async add(req: Request, res: Response, next: NextFunction) {
    try {
      const requestData = req.body;
      const validateRequest = validateRequestInput(areaValidator.add, requestData);
      if (!validateRequest.isValid) {
        return res.status(constants.CODES.VALIDATION_FAILED).send({
          success: false,
          message: constants.MESSAGES.GENERAL.VALIDATION_FAILED,
          data: validateRequest.error,
        });
      }

      const area: any[] = await sequelize.query('CALL sp_area_add(:code, :name, :cityId);', {
        replacements: {
          code: requestData.code,
          name: requestData.name,
          cityId: requestData.cityId,
        },
      });

      if (area[0].message === 'area already exists') {
        return res.status(constants.CODES.VALIDATION_FAILED).send({
          success: false,
          message: constants.MESSAGES.AREA.ALREADY_EXISTS,
        });
      } else {
        return res.status(constants.CODES.SUCCESS).send({
          success: true,
          data: constants.MESSAGES.AREA.CREATED,
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
      const validateRequest = validateRequestInput(areaValidator.list, requestData);
      if (!validateRequest.isValid) {
        return res.status(constants.CODES.VALIDATION_FAILED).send({
          success: false,
          message: constants.MESSAGES.GENERAL.VALIDATION_FAILED,
          data: validateRequest.error,
        });
      }

      const areas = await sequelize.query('CALL sp_area_list(:offset, :limit, :cityId);', {
        replacements: {
          offset: requestData.offset || null,
          limit: requestData.limit || null,
          cityId: requestData.cityId || null,
        },
      });
      return res.status(constants.CODES.SUCCESS).send({
        success: true,
        data: areas,
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
      const validateRequest = validateRequestInput(areaValidator.edit, requestData);
      if (!validateRequest.isValid) {
        return res.status(constants.CODES.VALIDATION_FAILED).send({
          success: false,
          message: constants.MESSAGES.GENERAL.VALIDATION_FAILED,
          data: validateRequest.error,
        });
      }

      const area: any[] = await sequelize.query(
        `CALL sp_area_edit(
          :areaId,
          :code,
          :name,
          :status,
          :cityId
        );`,
        {
          replacements: {
            areaId: requestData.areaId,
            code: requestData.code || null,
            name: requestData.name || null,
            status: requestData.status || null,
            cityId: requestData.cityId || null,
          },
        },
      );

      if (area[0].message === 'area not found') {
        return res.status(constants.CODES.NOT_FOUND).send({
          success: false,
          message: constants.MESSAGES.AREA.DOES_NOT_EXIST,
        });
      } else if (area[0].message === 'area already exists') {
        return res.status(constants.CODES.VALIDATION_FAILED).send({
          success: false,
          message: constants.MESSAGES.AREA.ALREADY_EXISTS,
        });
      } else {
        return res.status(constants.CODES.SUCCESS).send({
          success: true,
          data: constants.MESSAGES.AREA.UPDATED,
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
