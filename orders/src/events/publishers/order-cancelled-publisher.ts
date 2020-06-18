import { Publisher, OrderCancelledEvent, Subjects } from '@tickitzz/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
