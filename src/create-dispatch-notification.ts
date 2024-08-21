import { Server } from "socket.io";

const createDispatchNotification =
  (server: Server) =>
  (notification: { recipient: string; type: string; payload: object }) => {
    server
      .to(notification.recipient)
      .emit(notification.type, notification.payload);
  };

export default createDispatchNotification;
