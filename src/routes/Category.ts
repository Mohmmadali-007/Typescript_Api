import { Router } from 'express';
import categoryController from '../controllers/Category';
import passport from 'passport';

class CategoryRoutes {
  router = Router();
  categoryController = new categoryController();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    this.router
      .route('/add')
      .post(
        passport.authenticate(['company', 'domain'], { session: false }),
        this.categoryController.add,
      );
    this.router
      .route('/list')
      .post(
        passport.authenticate(['company', 'domain', 'user'], { session: false }),
        this.categoryController.list,
      );
    this.router
      .route('/edit')
      .post(
        passport.authenticate(['company', 'domain'], { session: false }),
        this.categoryController.edit,
      );
  }
}

export default new CategoryRoutes().router;
