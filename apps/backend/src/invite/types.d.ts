type Uuid = `${string}-${string}-${string}-${string}-${string}`;

type ServiceInviteCreationDetails = {
  inviter: string;
  invitee: string;
};

type InviteDetails = {
  inviter: string;
  invitee: string;
  uuid: Uuid;
  exp: number;
  status: "PENDING" | "ACCEPTED";
};

type InviteServiceEventHandler = <T extends InviteDetails>(
  message: T,
) => Promise<unknown>;

type InviteServiceEventPublishers = Record<
  "INVITATION_CREATED",
  InviteServiceEventHandler
>;
