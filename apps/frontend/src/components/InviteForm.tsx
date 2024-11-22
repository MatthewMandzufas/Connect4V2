import { useState } from "react";

type InviteDetails = {
  invitee: string;
  inviter: string;
};

type InviteResponse = {
  isSuccess: boolean;
  message: string;
};

type InviteFormProps = {
  inviteHandler: (inviteValues: InviteDetails) => Promise<InviteResponse>;
};

const InviteForm = ({ inviteHandler }: InviteFormProps) => {
  const [invitee, setInvitee] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [message, setMessage] = useState("");

  return (
    <div className="flex flex-col justify-start gap-5 items-center min-h-10 max-h- max-w-48 border border-black py-10 ">
      <input
        type="text"
        className="border border-solid border-black rounded w-3/4 text-xs p-2"
        onChange={(event) => {
          setInvitee(event.target.value);
        }}
        placeholder="Enter email here..."
      />
      <button
        onClick={async (event) => {
          event.preventDefault();
          const response = await inviteHandler({
            invitee,
            inviter: "john@mail.com",
          });
          setIsSuccess(response.isSuccess);
          setMessage(response.message);
        }}
        className="border border-solid rounded border-black p-1 text-blue-500 hover:text-blue-900 "
      >
        Send
      </button>
      <p className={isSuccess ? "text-green-500" : "text-red-500"}>{message}</p>
    </div>
  );
};

export default InviteForm;
