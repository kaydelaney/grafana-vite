export interface CustomEndpointTransportOptions {
  endpoint: string;
  fetchParameters?: Partial<RequestInit>;
}

/**
 * This is a copy of sentry's FetchTransport, edited to be able to push to any custom url
 * instead of using Sentry-specific endpoint logic.
 * Also transforms some of the payload values to be parseable by go.
 * Sends events sequentially and implements back-off in case of rate limiting.
 */

export class CustomEndpointTransport {}
