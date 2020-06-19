import { Message } from 'node-nats-streaming';
import { OrderCancelledEvent, OrderStatus } from '@tickitzz/common';
import mongoose from 'mongoose';

import { OrderCancelledListener } from '../order-cancelled-listener';
import { Ticket } from '../../../models/ticket';
import { natsWrapper } from '../../../nats-wrapper';

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const ticket = await global.createTicket();
  const orderId = mongoose.Types.ObjectId().toHexString();
  ticket.set({ orderId });
  await ticket.save();

  const data: OrderCancelledEvent['data'] = {
    id: orderId,
    version: 0,
    ticket: { id: ticket.id }
  };
  // @ts-ignore
  const msg: Message = { ack: jest.fn() };

  return { listener, ticket, data, orderId, msg };
};

it('updates ticket, publishes & acks', async () => {
  const { listener, ticket, data, orderId, msg } = await setup();

  await listener.onMessage(data, msg);
  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).not.toBeDefined();
  expect(msg.ack).toHaveBeenCalled();
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
