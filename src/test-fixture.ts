import { Express } from "express";
import { generateKeyPair } from "jose";
import request, { Response } from "supertest";
import { appFactory } from "./app";

type UserDetails = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

interface Fixture {
  signUpUser: (userDetails: UserDetails) => Promise<Response>;
}
export default class TestFixture implements Fixture {
  private app: Promise<Express> | Express;

  constructor(app?: Express) {
    this.app = app ?? this.#generateNewApp();
  }

  async #generateNewApp() {
    return appFactory({
      stage: "test",
      keys: {
        jwtKeyPair: await generateKeyPair("RS256"),
      },
    });
  }

  async signUpUser(userDetails: UserDetails) {
    const response = await request(await this.app)
      .post("/user/signup")
      .send(userDetails);
    return response;
  }
}
