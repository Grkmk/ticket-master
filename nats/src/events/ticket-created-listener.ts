import { Message } from 'node-nats-streaming';

import { Listener, TicketCreatedEvent, Subjects } from '@tickitzz/common';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName = 'payments-service';

  onMessage(data: any, msg: Message) {
    console.log('Data event', data);
    msg.ack();
  }
}
