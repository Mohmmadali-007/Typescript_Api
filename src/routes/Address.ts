import { Router } from 'express';
import addressController from '../controllers/Address';
import passport from 'passport';

class AddressRoutes {
  router = Router();
  addressController = new addressController();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    this.router
      .route('/add')
      .post(passport.authenticate('user', { session: false }), this.addressController.add);
    this.router
      .route('/list')
      .post(passport.authenticate('user', { session: false }), this.addressController.list);
    this.router
      .route('/edit')
      .post(passport.authenticate('user', { session: false }), this.addressController.edit);
  }
}

export default new AddressRoutes().router;
