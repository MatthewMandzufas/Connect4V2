import { Socket } from "socket.io";

const createDispatchNotification =
  (socket: Socket) =>
  (notification: { recipient: string; type: string; payload: object }) =>
    socket.emit(notification.type, notification.payload);

export default createDispatchNotification;
