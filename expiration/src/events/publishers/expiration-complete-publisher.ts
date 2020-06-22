import { Publisher, ExpirationCompleteEvent, Subjects } from '@tickitzz/common';

export class ExpirationCompletePublisher extends Publisher<
  ExpirationCompleteEvent
> {
  readonly subject = Subjects.ExpirationComplete;
}
