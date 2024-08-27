import { Express } from "express";
import http from "http";
import { Server } from "socket.io";

type ServerSideWebSocketOptions = {
  path: string;
  port: number;
};

export const createServerSideWebSocket = (
  app: Express,
  { path, port }: ServerSideWebSocketOptions
) => {
  const httpServer = http.createServer(app);

  const io = new Server(httpServer);
  io.of(path).on("connection", (socket) => {});

  httpServer.listen(port, () => {});

  const fullPath = `ws://localhost:${port}${path}`;
  return fullPath;
};
