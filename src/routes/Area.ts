import { Router } from 'express';
import areaController from '../controllers/Area';
import passport from 'passport';

class AreaRoutes {
  router = Router();
  areaController = new areaController();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    this.router
      .route('/add')
      .post(passport.authenticate('superAdmin', { session: false }), this.areaController.add);
    this.router.route('/list').post(this.areaController.list);
    this.router
      .route('/edit')
      .post(passport.authenticate('superAdmin', { session: false }), this.areaController.edit);
  }
}

export default new AreaRoutes().router;
