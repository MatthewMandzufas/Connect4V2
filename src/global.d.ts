import {
  InviteEvents,
  InviteServiceEventHandler,
} from "./invite/invite-service.d";

type Uuid = `${string}-${string}-${string}-${string}-${string}`;

type JwtPublicKey = Uint8Array;
type Stage = "production" | "test";

type ServiceEvent = InviteEvents;

export type InternalEventPublisher<P, R> = (eventDetails: P) => Promise<R>;

export type ServiceEventHandler = InviteServiceEventHandler;

export type ServiceEventHandlers = Record<ServiceEvent, ServiceEventHandler>;
