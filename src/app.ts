import { resolveRouters, RouterType } from "@/resolve-routers";
import express from "express";
import { Env } from "./global";

const router = resolveRouters(process.env.NODE_ENV as Env);

export const app = express();
app.use(express.json());
app.use("/user", router[RouterType.userRouter]);
