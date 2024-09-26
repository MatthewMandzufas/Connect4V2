import express from "express";
import validateUserSignupRequestBody from "./validate-user-signup-request-body";

export default express.Router().post("/signup", (req, res, next) => {
  const validationResult = validateUserSignupRequestBody(req.body);
  if (validationResult.isValid) {
    next();
  } else {
    res.status(403).send({ errors: validationResult.errors });
  }
});
