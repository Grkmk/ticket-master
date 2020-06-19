import {
  Listener,
  OrderCancelledEvent,
  Subjects,
  NotFoundError
} from '@tickitzz/common';
import { Message } from 'node-nats-streaming';

import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';
import { queueGroupName } from './queue-group-name';
import { Ticket } from '../../models/ticket';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const ticket = await Ticket.findById(data.ticket.id);
    if (!ticket) throw new NotFoundError();

    ticket.set({ orderId: undefined });
    await ticket.save();

    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      orderId: ticket.orderId,
      version: ticket.version
    });

    msg.ack();
  }
}
