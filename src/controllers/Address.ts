import { Request, Response, NextFunction } from 'express';
import { addressValidator } from '../validator/address';
import { validateRequestInput } from '../validator';
import constants from '../utils/constants';
import { sequelize } from '../db/db';

export default class Address {
  constructor() {}

  async add(req: Request, res: Response, next: NextFunction) {
    try {
      const requestData = req.body;
      const validateRequest = validateRequestInput(addressValidator.add, requestData);
      if (!validateRequest.isValid) {
        return res.status(constants.CODES.VALIDATION_FAILED).send({
          success: false,
          message: constants.MESSAGES.GENERAL.VALIDATION_FAILED,
          data: validateRequest.error,
        });
      }

      let userId: number = -1;
      if (req.user && 'isUser' in req.user && 'id' in req.user) {
        userId = Number(req.user.id);
      }

      const address: any[] = await sequelize.query(
        `CALL sp_address_add(
            :areaId,
            :userId,
            :name,
            :addressLine1,
            :addressLine2,
            :road,
            :landmark,
            :mobile,
            :isDefault,
            :label,
            :latitude,
            :longitude
        )`,
        {
          replacements: {
            areaId: requestData.areaId,
            userId: userId,
            name: requestData.name,
            addressLine1: requestData.addressLine1,
            addressLine2: requestData.addressLine2,
            road: requestData.road,
            landmark: requestData.landmark,
            mobile: requestData.mobile,
            isDefault: requestData.isDefault,
            label: requestData.label || 'home',
            latitude: requestData.latitude || 0,
            longitude: requestData.longitude || 0,
          },
        },
      );

      if (address[0].message === 'pincode not found') {
        return res.status(constants.CODES.VALIDATION_FAILED).send({
          success: false,
          message: constants.MESSAGES.ADDRESS.NOT_FOUND,
        });
      } else {
        return res.status(constants.CODES.SUCCESS).send({
          success: true,
          data: constants.MESSAGES.ADDRESS.ADDED,
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
      const validateRequest = validateRequestInput(addressValidator.list, requestData);
      if (!validateRequest.isValid) {
        return res.status(constants.CODES.VALIDATION_FAILED).send({
          success: false,
          message: constants.MESSAGES.GENERAL.VALIDATION_FAILED,
          data: validateRequest.error,
        });
      }

      let userId: number = -1;
      if (req.user && 'isUser' in req.user && 'id' in req.user) {
        userId = Number(req.user.id);
      }

      const addresss = await sequelize.query('CALL sp_address_list(:offset, :limit, :userId);', {
        replacements: {
          offset: requestData.offset || null,
          limit: requestData.limit || null,
          userId: userId,
        },
      });
      return res.status(constants.CODES.SUCCESS).send({
        success: true,
        data: addresss,
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
      const validateRequest = validateRequestInput(addressValidator.edit, requestData);
      if (!validateRequest.isValid) {
        return res.status(constants.CODES.VALIDATION_FAILED).send({
          success: false,
          message: constants.MESSAGES.GENERAL.VALIDATION_FAILED,
          data: validateRequest.error,
        });
      }

      let userId: number = -1;
      if (req.user && 'isUser' in req.user && 'id' in req.user) {
        userId = Number(req.user.id);
      }

      const address: any[] = await sequelize.query(
        `CALL sp_address_edit(
            :addressId,
            :areaId,
            :userId,
            :name,
            :addressLine1,
            :addressLine2,
            :road,
            :landmark,
            :mobile,
            :isDefault,
            :label,
            :latitude,
            :longitude,
            :status
        )`,
        {
          replacements: {
            addressId: requestData.addressId,
            areaId: requestData.areaId || null,
            userId: userId,
            name: requestData.name || null,
            addressLine1: requestData.addressLine1 || null,
            addressLine2: requestData.addressLine2 || null,
            road: requestData.road || null,
            landmark: requestData.landmark || null,
            mobile: requestData.mobile || null,
            isDefault: requestData.hasOwnProperty('isDefault') ? requestData.isDefault : null,
            label: requestData.label || null,
            latitude: requestData.hasOwnProperty('latitude') ? requestData.latitude : null,
            longitude: requestData.hasOwnProperty('longitude') ? requestData.longitude : null,
            status: requestData.status || null,
          },
        },
      );

      if (address[0].message === 'address not found') {
        return res.status(constants.CODES.NOT_FOUND).send({
          success: false,
          message: constants.MESSAGES.ADDRESS.DOES_NOT_EXIST,
        });
      } else if (address[0].message === 'pincode not found') {
        return res.status(constants.CODES.VALIDATION_FAILED).send({
          success: false,
          message: constants.MESSAGES.ADDRESS.NOT_FOUND,
        });
      } else {
        return res.status(constants.CODES.SUCCESS).send({
          success: true,
          data: constants.MESSAGES.ADDRESS.UPDATED,
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
