const request = require("supertest");
const app = require("./index");

describe("Project Microservice", () => {
  describe("POST /createProject", () => {
    it("should return a 201 response with the project id", async () => {
      const response = await request(app)
        .post("/createProject")
        .set("Accept", "application/json")
        .set("Authorization", "Bearer your auth token")
        .send({ name: "testProject", description: "test Project" });
      expect(response.status).toBe(201);
      expect(response.body.projectId).toBeDefined();
    });
    // it("should return a 500 response with an error message if project is not created", async () => {
    //   const response = await request(app)
    //     .post("/createProject")
    //     .set("Accept", "application/json")
    //     .send({ description: "test Project" });
    //   expect(response.status).toBe(500);
    // });
  });
});
