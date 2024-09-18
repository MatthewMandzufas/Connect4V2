import { Uuid } from "@/global";

export type InviteCreationDetails = {
  inviter: string;
  invitee: string;
};

export enum InviteEvents {
  INVITATION_CREATED = "INVITATION_CREATED",
}

export enum InviteStatus {
  PENDING = "PENDING",
}

export type InviteDetails = {
  inviter: string;
  invitee: string;
  uuid: Uuid;
  exp: number;
  status: InviteStatus;
};

export type InviteServiceEventHandler = <T extends InviteDetails>(
  message: T
) => Promise<unknown>;

export type InviteServiceEventPublishers = Record<
  InviteEvents,
  InviteServiceEventHandler
>;
