import InMemoryUserRepositoryFactory, {
  PersistedUser,
} from "@/user/in-memory-user-repository";
import UserService from "@/user/user-service";
import express from "express";

const userRouter = express.Router();
const userService = new UserService(new InMemoryUserRepositoryFactory());

userRouter.post("/signup", (req, res, next) => {
  const { firstName, lastName, email } = req.body;
  userService
    .create({ firstName, lastName, email })
    .then((user: PersistedUser) => res.send(user))
    .catch(next);
});

export default userRouter;
