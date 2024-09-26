type InviteReceivedMessage = {
  inviter: string;
  invitee: string;
  exp: number;
  uuid: string;
  status: InviteStatus.PENDING;
};
