const request = require("supertest");
const app = require("./index");
const axios = require("axios");

describe("Member Microservice", () => {
  let authToken;

  beforeAll(async () => {
    const response = await axios.post(`${process.env.TAIGA_API_BASE_URL}/auth`, {
      type: "normal",
      username: "SERtestuser",
      password: "testuser",
    });
    authToken = response.data.auth_token;
  });

  describe("POST /createMember", () => {
    it("should return a 201 response with the member id", async () => {
      const response = await request(app)
        .post("/createMember")
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ username: "sambhavv14asu", projectId: 1889495 });
      expect(response.status).toBe(201);
      expect(response.body.memberId).toBeDefined();
    });

    it("should return a 500 response with an error message if member is not created", async () => {
      const response = await request(app)
        .post("/createMember")
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ projectId: 7119, username: "sambhavv14" });
      expect(response.status).toBe(500);
      expect(response.body.error).toBeDefined();
    });
  });
});
