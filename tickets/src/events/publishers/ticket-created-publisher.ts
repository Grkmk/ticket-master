import { Publisher, TicketCreatedEvent, Subjects } from '@tickitzz/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
