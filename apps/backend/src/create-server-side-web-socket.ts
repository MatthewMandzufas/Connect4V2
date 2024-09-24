import { Express } from "express";
import http from "http";
import { jwtDecrypt, KeyLike } from "jose";
import { AddressInfo } from "net";
import { Server } from "socket.io";

type ServerSideWebSocketOptions = {
  path?: string;
  privateKey: KeyLike;
};

export type ExpressWithPortAndSocket = Express & {
  port?: number;
  server?: Server;
};

export const createSocketServer = (
  app: ExpressWithPortAndSocket,
  { path, privateKey }: ServerSideWebSocketOptions
) => {
  const httpServer = http.createServer(app).listen().unref();

  const port = (httpServer.address() as AddressInfo).port;

  const io = new Server(httpServer);

  io.of(path).on("connection", async (socket) => {
    const token = socket.handshake.auth.token;

    const {
      payload: { userName },
    } = await jwtDecrypt(token, privateKey);

    socket.join(userName as string);
    socket.emit("connection_established");
  });

  app.server = io;
  app.port = port;
};
