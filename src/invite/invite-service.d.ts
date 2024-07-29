export type InviteCreationDetails = {
  inviter: String;
  invitee: String;
};

export enum InviteStatus {
  PENDING = "PENDING",
}

export type InviteDetails = {
  inviter: String;
  invitee: String;
  uuid: String;
  exp: number;
  status: InviteStatus;
};
