import { Application } from 'express';
import currencyRouter from './Currency';
import categoryRouter from './Category';
import countryRouter from './Country';
import cityRouter from './City';
import areaRouter from './Area';
import sellerRoutes from './Seller';
import addressRouter from './Address';

export default class Routes {
  constructor(app: Application) {
    // super admin routes
    app.use('/api/currency', currencyRouter);
    app.use('/api/category', categoryRouter);
    app.use('/api/currency', currencyRouter);
    app.use('/api/country', countryRouter);
    app.use('/api/city', cityRouter);
    app.use('/api/area', areaRouter);
    app.use('/api/seller', sellerRoutes);
    app.use('/api/address', addressRouter);

  }
}
