import request from "supertest";
import { getConnection } from "typeorm";
import { app } from "../app";

import createConnection from "../database";

describe("User", async () => {
  beforeAll(async () => {
    const connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    const connection = getConnection();
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to create a new user", async () => {
    const response = await request(app).post("/users").send({
      email: "user1@email.com",
      name: "User One",
    });

    expect(response.status).toBe(201);
  });

  it("Should not to be able to create a user with an exists email", async () => {
    const response = await request(app).post("/users").send({
      email: "user1@email.com",
      name: "User Two",
    });

    expect(response.status).toBe(400);
  });
});
