import { Router } from 'express';
import cityController from '../controllers/City';
import passport from 'passport';

class CityRoutes {
  router = Router();
  cityController = new cityController();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    this.router
      .route('/add')
      .post(passport.authenticate('superAdmin', { session: false }), this.cityController.add);
    this.router.route('/list').post(this.cityController.list);
    this.router
      .route('/edit')
      .post(passport.authenticate('superAdmin', { session: false }), this.cityController.edit);
  }
}

export default new CityRoutes().router;
