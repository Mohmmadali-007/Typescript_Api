import { Router } from 'express';
import currencyController from '../controllers/Currency';
import passport from 'passport';

class currencyRoutes {
  router = Router();
  currencyController = new currencyController();

  constructor() {
    this.intializeRoutes();
  }
  intializeRoutes() {
    this.router
      .route('/add')
      .post(passport.authenticate('superAdmin', { session: false }), this.currencyController.add);
    this.router.route('/list').post(this.currencyController.list);
    this.router
      .route('/edit')
      .post(passport.authenticate('superAdmin', { session: false }), this.currencyController.edit);
  }
}
export default new currencyRoutes().router;
