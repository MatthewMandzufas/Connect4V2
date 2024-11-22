"use client";

import BackendApi from "@/backend-api";
import InviteForm from "@/components/InviteForm";
import InviteService from "@/services/invite-service";

type InviteDetails = { invitee: string; inviter: string };
type InviteResponse = {
  isSuccess: boolean;
  message: string;
};
type InviteHandler = (inviteDetails: InviteDetails) => Promise<InviteResponse>;

const inviteHandler: InviteHandler = async (inviteDetails) => {
  const backendApi = new BackendApi({ url: "http://localhost:3001" });
  const inviteService = new InviteService({ backendApi });

  return await inviteService.sendInvite(inviteDetails);
};

const LandingPage = () => {
  return (
    <div className="w-100 flex flex-col m-auto justify-center m-auto">
      <h1>Welcome to Connect4</h1>
      <InviteForm inviteHandler={inviteHandler} />
    </div>
  );
};

export default LandingPage;
