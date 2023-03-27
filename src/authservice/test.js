const request = require("supertest");
const app = require("./index");

describe("Authentication Microservice", () => {
  describe("POST /authenticate", () => {
    it("should return a 401 response with an error message for incorrect credentials", async () => {
      const response = await request(app)
        .post("/authenticate")
        .set("Accept", "application/json")
        .send({ username: "testUser", password: "invalidPass" });
      expect(response.status).toBe(401);
    });
  });
});
