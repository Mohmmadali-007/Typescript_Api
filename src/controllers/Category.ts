import { Request, Response, NextFunction } from 'express';
import { categoryValidator } from '../validator/category';
import { validateRequestInput } from '../validator';
import constants from '../utils/constants';
import { sequelize } from '../db/db';

export default class Category {
  constructor() {}

  async add(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res
          .status(constants.CODES.UNAUTHORIZED)
          .send(constants.MESSAGES.GENERAL.UNAUTHORIZED);
      }

      const requestData = req.body;
      const validateRequest = validateRequestInput(categoryValidator.add, requestData);
      if (!validateRequest.isValid) {
        return res.status(constants.CODES.VALIDATION_FAILED).send({
          success: false,
          message: constants.MESSAGES.GENERAL.VALIDATION_FAILED,
          data: validateRequest.error,
        });
      }

      let companyId: number;
      let domainId: number | undefined;
      if (req.user.isCompany) {
        companyId = req.user.id;
        domainId = req.user.domainId;
      } else {
        domainId = req.user.id;
        if (requestData.companyId) {
          companyId = requestData.companyId;
        } else {
          return res.status(constants.CODES.BAD_REQUEST).send({
            success: false,
            message: constants.MESSAGES.CATEGORY.COMPANY_ID_REQUIURED,
          });
        }
      }
      const categoryLanguages = JSON.stringify(requestData.categoryLanguages);

      await sequelize.query(
        `CALL sp_category_add(
          :companyId, 
          :domainId,
          :categoryLanguages
          );`,
        {
          replacements: {
            companyId: companyId,
            domainId: domainId,
            categoryLanguages: categoryLanguages,
          },
        },
      );
      return res.status(constants.CODES.SUCCESS).send({
        success: true,
        message: constants.MESSAGES.CATEGORY.CREATED,
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
      if (!req.user) {
        return res
          .status(constants.CODES.UNAUTHORIZED)
          .send(constants.MESSAGES.GENERAL.UNAUTHORIZED);
      }
      const requestData = req.body;
      const validateRequest = validateRequestInput(categoryValidator.list, requestData);
      if (!validateRequest.isValid) {
        return res.status(constants.CODES.VALIDATION_FAILED).send({
          success: false,
          message: constants.MESSAGES.GENERAL.VALIDATION_FAILED,
          data: validateRequest.error,
        });
      }

      let companyId: number | undefined;
      let domainId: number | undefined;
      if (requestData.companyId) {
        companyId = requestData.companyId;
      } else if (req.user.isCompany) {
        companyId = req.user.id;
      } else if (req.user.isDomain) {
        domainId = req.user.id;
      }

      const category = await sequelize.query(
        `CALL sp_category_list(
          :ids,
          :categoryName, 
          :offsetValue, 
          :limitValue,
          :companyId,
          :domainId
          );`,
        {
          replacements: {
            ids: null,
            categoryName: requestData.name || null,
            offsetValue: requestData.offset || null,
            limitValue: requestData.limit || null,
            companyId: companyId || null,
            domainId: domainId || null,
          },
        },
      );
      return res.status(constants.CODES.SUCCESS).send({
        success: true,
        data: category,
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
      if (!req.user) {
        return res
          .status(constants.CODES.UNAUTHORIZED)
          .send(constants.MESSAGES.GENERAL.UNAUTHORIZED);
      }
      const requestData = req.body;
      const validateRequest = validateRequestInput(categoryValidator.edit, requestData);
      if (!validateRequest.isValid) {
        return res.status(constants.CODES.VALIDATION_FAILED).send({
          success: false,
          message: constants.MESSAGES.GENERAL.VALIDATION_FAILED,
          data: validateRequest.error,
        });
      }

      let companyId: number | undefined;
      if (req.user.isCompany) {
        companyId = req.user.id;
      } else {
        if (requestData.companyId) {
          companyId = requestData.companyId;
        } else {
          return res.status(constants.CODES.BAD_REQUEST).send({
            success: false,
            message: constants.MESSAGES.CATEGORY.COMPANY_ID_REQUIURED,
          });
        }
      }

      const categoryLanguages = JSON.stringify(requestData.categoryLanguages);
      await sequelize.query(
        `CALL sp_category_edit(
          :categoryId,
          :companyId, 
          :categoryLanguages, 
          :status
          );`,
        {
          replacements: {
            categoryId: requestData.categoryId,
            companyId: companyId,
            categoryLanguages: categoryLanguages,
            status: requestData.status,
          },
        },
      );
      return res.status(constants.CODES.SUCCESS).send({
        success: true,
        message: constants.MESSAGES.CATEGORY.UPDATED,
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
