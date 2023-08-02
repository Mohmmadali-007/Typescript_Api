import { Router } from 'express';
import sellerController from '../controllers/Seller';

class SellerRoutes {
  router = Router();
  sellerController = new sellerController();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    this.router.route('/add').post(this.sellerController.add);
    this.router.route('/list').post(this.sellerController.list);
    this.router.route('/edit').post(this.sellerController.edit);
    this.router.route('/login').post(this.sellerController.login);
  }
}

export default new SellerRoutes().router;
