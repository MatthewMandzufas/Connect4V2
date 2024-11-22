import { BackendApiInterface } from "@/backend-api";

type InviteServiceParameters = {
  backendApi: BackendApiInterface;
};

type InviteDetails = {
  invitee: string;
  inviter: string;
};
type InviteServicePayload = {
  isSuccess: boolean;
  message: string;
};
interface InviteServiceInterface {
  sendInvite: (inviteDetails: InviteDetails) => Promise<InviteServicePayload>;
}

export default class InviteService implements InviteServiceInterface {
  #backendApi: BackendApiInterface;

  constructor({ backendApi }: InviteServiceParameters) {
    this.#backendApi = backendApi;
  }

  async sendInvite(inviteDetails: InviteDetails) {
    const response = await this.#backendApi.sendInvite(inviteDetails);
    console.log(response);
    return {
      isSuccess: response.status === 201,
      message: response.status === 201 ? "Invite Sent" : "User does not exist",
    };
  }
}
