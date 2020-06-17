import { Publisher, TicketUpdatedEvent, Subjects } from '@tickitzz/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
