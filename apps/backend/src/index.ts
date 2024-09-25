import { importJWK, KeyLike } from "jose";
import { Subject } from "rxjs";
import { appFactory } from "./app";
import { InternalEventPublisher, Stage } from "./global";
import { InviteCreatedEvent } from "./invite/create-invite-event-listener";
import resolvePublishInternalEvent from "./resolve-publish-internal-event";

async function main() {
  const subject = new Subject<InviteCreatedEvent>();
  const app = appFactory({
    keys: {
      jwtKeyPair: {
        publicKey: (await importJWK(
          JSON.parse(process.env.JWT_PUBLIC_KEY),
          "RS256",
        )) as KeyLike,
        privateKey: (await importJWK(
          JSON.parse(process.env.JWT_PRIVATE_KEY),
          "RS256",
        )) as KeyLike,
      },
    },
    stage: process.env.STAGE as unknown as Stage,
    publishInternalEvent: resolvePublishInternalEvent(
      subject,
    ) as unknown as InternalEventPublisher<unknown, unknown>,
    internalEventSubscriber: subject,
  });

  app.listen(process.env.PORT, () => {
    console.log(`Listening on port: ${process.env.PORT}`);
  });
}

main().catch((error) => console.error("Error starting: ", error));
