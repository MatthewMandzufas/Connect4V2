import { Channel } from "amqplib";
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

type SendInviteDetails = {
  inviter: string;
  invitee: string;
  authField: string;
};

interface Fixture {
  sendInvite: ({
    inviter,
    invitee,
    authField,
  }: SendInviteDetails) => Promise<Response>;
  sendInviteEmails: ({ inviter, invitee }) => Promise<Response>;
  signUpUserWithDetails: (userDetails: UserDetails) => Promise<Response>;
  loginUser: (userCredentials: UserCredentials) => Promise<Response>;
  loginUserAuth: (userCredentials: UserCredentials) => Promise<string>;
  signUpUserWithEmail: (userEmail: string) => Promise<Response>;
  signUpAndLoginEmail: (userEmail: string) => Promise<string>;
}
export default class TestFixture implements Fixture {
  private app: Promise<Express> | Express;

  constructor(app?: Express) {
    this.app = app ?? this.#generateNewApp();
  }

  channel: Channel;
  async #generateNewApp() {
    return appFactory({
      stage: "test",
      keys: {
        jwtKeyPair: await generateKeyPair("RS256"),
      },
      publishEvent: (queue, payload) => Promise.resolve(),
    });
  }

  async sendInvite({ inviter, invitee, authField }: SendInviteDetails) {
    const response = await request(await this.app)
      .post("/invite")
      .set("Authorization", authField)
      .send({ inviter, invitee });
    return response;
  }

  async sendInviteEmails({ inviter, invitee }) {
    await this.signUpUserWithEmail(invitee);
    const authField = await this.signUpAndLoginEmail(inviter);
    const response = await this.sendInvite({ inviter, invitee, authField });
    return response;
  }

  async signUpAndLoginEmail(userEmail: string) {
    await this.signUpUserWithEmail(userEmail);
    const response = await this.loginUserAuth({
      userName: userEmail,
      password: "GenericPassword",
    });
    return response;
  }

  async loginUser(userCredentials: UserCredentials) {
    const response = await request(await this.app)
      .post("/user/login")
      .send(userCredentials);
    return response;
  }

  async loginUserAuth(userCredentials: UserCredentials) {
    const response = await request(await this.app)
      .post("/user/login")
      .send(userCredentials);

    const authField = response.header.authorization;
    return authField;
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
