import express from "express";
const userRouter = express.Router();

userRouter.post("/signup", (req, res, next) => {
  const { firstName, lastName, email } = req.body;
  userService
    .create({ firstName, lastName, email })
    .then((user: User) => res.send(user))
    .catch(next);
});

export default userRouter;
