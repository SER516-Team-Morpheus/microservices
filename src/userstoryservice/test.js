const request = require("supertest");
const app = require("./index");

describe("User story Microservice", () => {
  describe("POST /createUserstory", () => {
    it("should return a 201 response with the user story id", async () => {
      const response = await request(app)
        .post("/createUserstory")
        .set("Accept", "application/json")
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjgwMTUzMDU3LCJqdGkiOiIxNDY3MzFlMGEzMzg0MjMzYmI0MDdiYWM3YTczNzYxOSIsInVzZXJfaWQiOjU1OTIxNX0.RzYvAwZTNYI-tm2J4Fz0FOOBxIcXvzEWolA38a5p-jQ"
        )
        .send({ project: 711904, subject: "test user story" });
      expect(response.status).toBe(201);
      expect(response.body.userstoryId).toBeDefined();
    });
    it("should return a 500 response with an error message if user story is not created", async () => {
      const response = await request(app)
        .post("/createUserstory")
        .set("Accept", "application/json")
        .set(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjgwMTUzMDU3LCJqdGkiOiIxNDY3MzFlMGEzMzg0MjMzYmI0MDdiYWM3YTczNzYxOSIsInVzZXJfaWQiOjU1OTIxNX0.RzYvAwZTNYI-tm2J4Fz0FOOBxIcXvzEWolA38a5p-jQ"
        )
        .send({ project: 7119, subject: "test user story" });
      expect(response.status).toBe(500);
    });
  });
});
