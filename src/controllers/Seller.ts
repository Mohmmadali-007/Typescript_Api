import { Request, Response, NextFunction } from 'express';
import { validateRequestInput } from '../validator';
import constants from '../utils/constants';
import { sequelize } from '../db/db';
import config from '../config/default';
import { createJwtToken } from '../services/jwt.service';
import * as bcrypt from 'bcryptjs';
import { sellerValidator } from '../validator/seller';

export default class Seller {
  constructor() {}

  async add(req: Request, res: Response, next: NextFunction) {
    try {
      const requestData = req.body;
      const validateRequest = validateRequestInput(sellerValidator.add, requestData);

      if (!validateRequest.isValid) {
        return res.status(constants.CODES.VALIDATION_FAILED).send({
          success: false,
          message: constants.MESSAGES.GENERAL.VALIDATION_FAILED,
          data: validateRequest.error,
        });
      }
      const seller: any[] = await sequelize.query(
        `CALL sp_seller_add(
                      :domainId,
                      :name,
                      :email,
                      :phone,
                      :password,
                      :address,
                      :cityId,
                      :companyIds
                      );`,
        {
          replacements: {
            domainId: requestData.domainId,
            name: requestData.name,
            email: requestData.email,
            phone: requestData.phone,
            password: bcrypt.hashSync(requestData.password, config.SALT_LENGTH),
            address: requestData.address,
            cityId: requestData.cityId,
            companyIds: JSON.stringify(requestData.companyIds) || null,
          },
        },
      );

      if (seller[0].message === 'Email or phone number already exists') {
        return res.status(constants.CODES.VALIDATION_FAILED).send({
          success: false,
          message: constants.MESSAGES.SELLER.ALREADY_EXISTS,
        });
      } else {
        return res.status(constants.CODES.SUCCESS).send({
          success: true,
          data: constants.MESSAGES.SELLER.CREATED,
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
      const validateRequest = validateRequestInput(sellerValidator.list, requestData);
      if (!validateRequest.isValid) {
        return res.status(constants.CODES.VALIDATION_FAILED).send({
          success: false,
          message: constants.MESSAGES.GENERAL.VALIDATION_FAILED,
          data: validateRequest.error,
        });
      }

      const sellers = await sequelize.query(
        `CALL sp_seller_list(
              :offset,
              :limit,
              :email,
              :phone,
              :sellerId,
              @totalCount
              );`,
        {
          replacements: {
            offset: requestData.offset || null,
            limit: requestData.limit || null,
            email: requestData.email || null,
            phone: requestData.phone || null,
            sellerId: requestData.sellerId || null,
          },
        },
      );

      const [countResult]: any[] = await sequelize.query('SELECT @totalCount AS totalCount;');

      return res.status(constants.CODES.SUCCESS).send({
        success: true,
        count: countResult[0].totalCount,
        data: sellers,
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
      const validateRequest = validateRequestInput(sellerValidator.edit, requestData);
      if (!validateRequest.isValid) {
        return res.status(constants.CODES.VALIDATION_FAILED).send({
          success: false,
          message: constants.MESSAGES.GENERAL.VALIDATION_FAILED,
          data: validateRequest.error,
        });
      }

      const seller: any[] = await sequelize.query(
        `CALL sp_seller_edit(
            :sellerId,
            :name,
            :address,
            :cityId,
            :password
            );`,
        {
          replacements: {
            sellerId: requestData.sellerId,
            name: requestData.name || null,
            address: requestData.address || null,
            cityId: requestData.cityId || null,
            password: bcrypt.hashSync(requestData.password, config.SALT_LENGTH) || null,
          },
        },
      );

      if (seller[0].message === 'seller not found') {
        return res.status(constants.CODES.NOT_FOUND).send({
          success: false,
          message: constants.MESSAGES.SELLER.SELLER_NOT_FOUND,
        });
      } else {
        return res.status(constants.CODES.SUCCESS).send({
          success: true,
          data: constants.MESSAGES.SELLER.UPDATED,
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

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const requestData = req.body;
      const validateRequest = validateRequestInput(sellerValidator.login, requestData);
      if (!validateRequest.isValid) {
        return res.status(constants.CODES.VALIDATION_FAILED).send({
          success: false,
          message: constants.MESSAGES.GENERAL.VALIDATION_FAILED,
          data: validateRequest.error,
        });
      }

      const seller: any[] = await sequelize.query('CALL sp_seller_login(:email,:domainId);', {
        replacements: {
          email: requestData.email,
          domainId: requestData.domainId,
        },
      });
      if (seller.length === 0) {
        return res.status(constants.CODES.VALIDATION_FAILED).send({
          success: false,
          message: constants.MESSAGES.SELLER.EMAIL_DOES_NOT_EXIST,
        });
      }

      if (seller[0].status !== 'active') {
        return res.status(constants.CODES.VALIDATION_FAILED).send({
          success: false,
          message: constants.MESSAGES.SELLER.NOT_ACTIVE,
        });
      }

      if (!bcrypt.compareSync(requestData.password, seller[0].password)) {
        return res.status(constants.CODES.VALIDATION_FAILED).send({
          success: false,
          message: constants.MESSAGES.SELLER.WRONG_PASSWORD,
        });
      }

      // Remove password
      delete seller[0].password;
      const token = createJwtToken(
        {
          id: seller[0].id,
          email: seller[0].email,
        },
        '2h',
      );
      return res.status(constants.CODES.SUCCESS).send({
        success: true,
        message: constants.MESSAGES.DOMAIN.LOGIN_SUCCESSFULLY,
        data: seller[0],
        token: token,
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
