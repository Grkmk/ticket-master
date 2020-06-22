import { Subjects, PaymentCreatedEvent, Publisher } from '@tickitzz/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
