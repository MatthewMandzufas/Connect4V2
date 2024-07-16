import userRouter from "@/user/user-router";
import express from "express";

export const app = express();

app.use("/user", userRouter);
