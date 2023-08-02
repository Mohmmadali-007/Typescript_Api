import { Router } from 'express';
import countryController from '../controllers/Country';
import passport from 'passport';

class CountryRoutes {
  router = Router();
  countryController = new countryController();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    this.router
      .route('/add')
      .post(passport.authenticate('superAdmin', { session: false }), this.countryController.add);
    this.router.route('/list').post(this.countryController.list);
    this.router
      .route('/edit')
      .post(passport.authenticate('superAdmin', { session: false }), this.countryController.edit);
  }
}

export default new CountryRoutes().router;
