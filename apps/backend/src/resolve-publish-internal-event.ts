import { Subject } from "rxjs";
import { InviteCreatedEvent } from "./invite/create-invite-event-listener";

const resolvePublishInternalEvent = (subject: Subject<InviteCreatedEvent>) => {
  if (process.env.STAGE === "DEV") {
    (eventDetails: InviteCreatedEvent) => {
      return Promise.resolve(subject.next(eventDetails));
    };
  } else {
    throw new Error("Prod not implemented");
  }
};

export default resolvePublishInternalEvent;
