import {
  InviteEvents,
  InviteServiceEventHandler,
} from "./invite/invite-service.d";

type Uuid = `${string}-${string}-${string}-${string}-${string}`;

type JwtPublicKey = Uint8Array;
type Stage = "production" | "test";

type ServiceEvent = InviteEvents;
export type ServiceEventHandler = InviteServiceEventHandler;

type InternalEventPublisher<P, R> = (eventDetails: P) => Promise<R>;

export type ServiceEventHandlers = Record<ServiceEvent, ServiceEventHandler>;

declare namespace NodeJS {
  interface ProcessEnv {
    STAGE: "DEV" | "PROD";
    PORT: string;
    JWT_PUBLIC_KEY: string;
    JWT_PRIVATE_KEY: string;
  }
}
