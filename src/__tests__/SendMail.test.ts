import request from "supertest";
import { getConnection } from "typeorm";
import { app } from "../app";

import createConnection from "../database";

describe("SendMail", async () => {
  beforeAll(async () => {
    const connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    const connection = getConnection();
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to send a new e-mail to an user", async () => {
    const userResponse = await request(app).post("/users").send({
      email: "user1@email.com",
      name: "User One",
    });

    const user = userResponse.body;

    const surveyResponse = await request(app).post("/surveys").send({
      title: "Survey Example One",
      description: "This is the description of Survey Example One",
    });

    const survey = surveyResponse.body;

    const response = await request(app).post("/sendMail").send({
      email: user.email,
      survey_id: survey.id,
    });

    expect(userResponse.body).toHaveProperty("email");
    expect(surveyResponse.body).toHaveProperty("id");
    expect(response.status).toBe(201);
  }, 10000000);

  it("Should not be able to send new email to inexistent user", async () => {
    const surveyResponse = await request(app).get("/surveys");

    const survey = surveyResponse.body;

    const response = await request(app).post("/sendMail").send({
      email: "inexistent@email.com",
      survey_id: survey[0].id,
    });

    expect(response.status).toBe(400);
  });

  it("Should not be able to send new email to inexistent survey", async () => {
    const usersResponse = await request(app).get("/users");

    const users = usersResponse.body;

    const response = await request(app).post("/sendMail").send({
      email: "this_primary_key_does_not_exists",
      user_id: users[0].id,
    });

    expect(response.status).toBe(400);
  });
});
