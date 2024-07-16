import UserService from "@/user/user-service";
import express from "express";

const userRouterFactory = (userService: UserService) => {
  const userRouter = express.Router();
  userRouter.post("/signup", (req, res, next) => {
    const { firstName, lastName, email } = req.body;
    userService
      .create({ firstName, lastName, email })
      .then((user) => res.status(201).send(user))
      .catch((error: Error) => {
        res.status(403).send({ errors: [error.message] });
      })
      .catch(next);
  });
  return userRouter;
};

export default userRouterFactory;
