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

type UserCredentials = {
  userName: string;
  password: string;
};

interface Fixture {
  signUpUserWithDetails: (userDetails: UserDetails) => Promise<Response>;
  loginUser: (userCredentials: UserCredentials) => Promise<Response>;
  signUpUserWithEmail: (userEmail: string) => Promise<Response>;
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

  async loginUser(userCredentials: UserCredentials) {
    const response = await request(await this.app)
      .post("/user/login")
      .send(userCredentials);
    return response;
  }

  async signUpUserWithEmail(userEmail: string) {
    const response = await request(await this.app)
      .post("/user/signup")
      .send({
        firstName: "GenericFirstName",
        lastName: "GenericLastName",
        email: userEmail,
        password: "GenericPassword",
      });
    return response;
  }

  async signUpUserWithDetails(userDetails: UserDetails) {
    const response = await request(await this.app)
      .post("/user/signup")
      .send(userDetails);
    return response;
  }
}
