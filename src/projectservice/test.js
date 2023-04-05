const request = require("supertest");
const app = require("./index");

describe("Project Microservice", () => {
  describe("POST /createProject", () => {
    it("should return a 201 response", async () => {
      const response = await request(app)
        .post("/createProject")
        .set("Accept", "application/json")
        .send({
          username: "SERtestuser",
          password: "testuser",
          name: "newtestProject",
          description: "testProject",
        });
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.projectId).toBeDefined();
      expect(response.body.projectName).toBeDefined();
      expect(response.body.slugName).toBeDefined();
      expect(response.body.description).toBeDefined();
    });
    it("should return a 500 response", async () => {
      const response = await request(app)
        .post("/createProject")
        .set("Accept", "application/json")
        .send({
          username: "SERtestuser",
          password: "tetuser",
          name: "testProject",
          description: "testProject",
        });
      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBeDefined();
    });
  });

  // test case for getProjectBySlug endpoint
  describe("GET /getProjectBySlug", () => {
    it("should return a 200 response", async () => {
      const response = await request(app)
        .get("/getProjectBySlug")
        .set("Accept", "application/json")
        .query({
          username: "SERtestuser",
          password: "testuser",
          name: "testProject",
        });
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.projectId).toBeDefined();
      expect(response.body.projectName).toBeDefined();
      expect(response.body.slugName).toBeDefined();
      expect(response.body.description).toBeDefined();
    });
    it("should return a 404 response", async () => {
      const response = await request(app)
        .get("/getProjectBySlug")
        .set("Accept", "application/json")
        .query({
          username: "SERtestuser",
          password: "testuser",
          name: "gibberish",
        });
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBeDefined();
    });
  });

  // test case for getProject
  describe("GET /getProject", () => {
    it("should return a 200 response", async () => {
      const response = await request(app)
        .get("/getProject")
        .set("Accept", "application/json")
        .query({
          username: "SERtestuser",
          password: "testuser",
        });
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.projects).toBeDefined();
    });
    it("should return a 404 response", async () => {
      const response = await request(app)
        .get("/getProject")
        .set("Accept", "application/json")
        .query({
          username: "SERtestuser",
          password: "testuse",
        });
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBeDefined();
    });
  });
});
