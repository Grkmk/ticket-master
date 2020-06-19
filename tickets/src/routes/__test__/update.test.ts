import request from 'supertest';
import mongoose from 'mongoose';

import { app } from '../../app';
import { natsWrapper } from '../../nats-wrapper';
import { Ticket } from '../../models/ticket';

it('returns 404 if id does not exist', async () => {
  const id = global.createId();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({ title: 'title', price: 5 })
    .expect(404);
});

it('returns 401 if user is not authenticated', async () => {
  const id = global.createId();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', [''])
    .send({ title: 'title', price: 5 })
    .expect(401);
});

it('returns 401 if user does not own the ticket', async () => {
  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({ title: 'title', price: 5 });

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', global.signin())
    .send({ title: 'title', price: 4 })
    .expect(401);
});

it('returns 400 if provided invalid inputs', async () => {
  const cookie = global.signin();

  const res = await request(app)
    .put('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'title', price: 5 });

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', cookie)
    .send({ title: '', price: 5 })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'title1', price: -5 })
    .expect(400);
});

it('updates ticket if given valid inputs', async () => {
  const cookie = global.signin();

  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'title', price: 5 });

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'title1', price: 1 })
    .expect(200);

  const res1 = await request(app).get(`/api/tickets/${res.body.id}`).send();

  expect(res1.body.title).toEqual('title1');
  expect(res1.body.price).toEqual(1);
});

it('publishes an event', async () => {
  const cookie = global.signin();

  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'title', price: 5 });

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'title1', price: 1 })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('rejects updates if ticket is reserved', async () => {
  const cookie = global.signin();

  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'title', price: 5 });

  const ticket = await Ticket.findById(res.body.id);
  ticket!.set({ orderId: mongoose.Types.ObjectId().toHexString() });
  await ticket!.save();

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'title1', price: 1 })
    .expect(400);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
