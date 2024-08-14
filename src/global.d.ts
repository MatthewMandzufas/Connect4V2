import { InviteEvents } from "./invite/invite-service.d";

type Uuid = `${string}-${string}-${string}-${string}-${string}`;

type JwtPublicKey = Uint8Array;
type Stage = "production" | "test";

type ServiceEvent = InviteEvents;
