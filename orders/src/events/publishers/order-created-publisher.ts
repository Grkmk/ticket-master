import { Publisher, OrderCreatedEvent, Subjects } from '@tickitzz/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
