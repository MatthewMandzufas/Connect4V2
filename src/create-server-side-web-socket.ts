import { Express } from "express";
import http from "http";
import { jwtDecrypt, KeyLike } from "jose";
import { Server } from "socket.io";

type ServerSideWebSocketOptions = {
  path?: string;
  port?: number;
  privateKey: KeyLike;
};

export const createSocketServer = (
  app: Express,
  { path, port, privateKey }: ServerSideWebSocketOptions
) => {
  const httpServer = http.createServer(app).unref();

  const io = new Server(httpServer);

  io.of(path).on("connection", async (socket) => {
    const token = socket.handshake.auth.token;

    const {
      payload: { userName },
    } = await jwtDecrypt(token, privateKey);

    socket.join(userName as string);
    socket.emit("connection_established");

    // console.log(`Socket with ${socket.id} has been connected!`);
  });

  httpServer.listen(port, () => {});
  const fullPath = `ws://localhost:${port}${path}`;
  return {
    fullPath,
    io,
  };
};
