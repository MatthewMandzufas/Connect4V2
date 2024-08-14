export type InviteCreationDetails = {
  inviter: string;
  invitee: string;
};

export type InviteServiceEventHandler = <T extends InviteDetails>(
  message: InviteDetails
) => Promise<void>;

export type InviteServiceEventHandlers = Record<
  InviteEvents,
  InviteServiceEventHandler
>;

export enum InviteEvents {
  INVITATION_CREATED = "INVITATION_CREATED",
}

export enum InviteStatus {
  PENDING = "PENDING",
}

export type InviteDetails = {
  inviter: string;
  invitee: string;
  uuid: string;
  exp: number;
  status: InviteStatus;
};
