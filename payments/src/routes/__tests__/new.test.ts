import request from 'supertest';
import mongoose from 'mongoose';
import { OrderStatus } from '@tickitzz/common';

import { app } from '../../app';
import { Order } from '../../models/order';

it('returns 404 when purchasing a non-existant order', async () => {
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({ token: 'asdfa', orderId: mongoose.Types.ObjectId().toHexString() })
    .expect(404);
});

it('returns 401 when purchasing an order that belongs to another user', async () => {
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 23,
    status: OrderStatus.Created
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({ token: 'asdfa', orderId: order.id })
    .expect(401);
});

it('returns 400 when purchasing a cancelled order', async () => {
  const userId = mongoose.Types.ObjectId().toHexString();

  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price: 23,
    status: OrderStatus.Cancelled
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({ token: 'asdfa', orderId: order.id })
    .expect(400);
});
