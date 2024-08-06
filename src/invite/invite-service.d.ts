export type InviteCreationDetails = {
  inviter: string;
  invitee: string;
};

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
