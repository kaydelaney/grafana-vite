import { EchoEvent, EchoEventType } from '@grafana/runtime';

export interface BaseTransport {
  sendEvent(event: any): PromiseLike<Response>;
}

export type SentryEchoEvent = EchoEvent<EchoEventType.Sentry, any>;

export interface User {
  email: string;
  id: number;
}
