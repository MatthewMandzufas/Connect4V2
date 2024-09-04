// import http from "http";
// import { KeyLike } from "jose";
// import { AddressInfo } from "net";
// import { appFactory } from "./app";
// import { createSocketServer } from "./create-server-side-web-socket";

// type ServerParameters = {
//   stage: "test" | "production";
//   keys: {
//     jwtKeyPair: KeyLike;
//   };
// };

// const createServer = ({ stage, keys }) => {
//   const httpServer = http.createServer().listen();
//   const port = (httpServer.address() as AddressInfo).port;
//   const authority = `localhost:${port}`;
//   const app = appFactory({
//     stage,
//     keys,
//     publishEvent,
//     emitEvent,
//     authority,
//   });
//   const socketServer = createSocketServer(app, { path: "/notification", port });
// };

// export default createServer;
