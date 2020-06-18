import express, { Request, Response } from 'express';
import { param } from 'express-validator';
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  UnauthorizedError
} from '@tickitzz/common';

import { Order } from '../models/order';

const router = express.Router();

router.get(
  '/api/orders/:orderId',
  requireAuth,
  [param('orderId').isMongoId()],
  validateRequest,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId).populate('ticket');
    if (!order) throw new NotFoundError();
    if (order.userId !== req.currentUser!.id) throw new UnauthorizedError();

    res.send(order);
  }
);

export { router as showOrderRouter };
