const request = require("supertest");
const app = require("./index");

describe("User story Microservices", () => {
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


  describe("GET /getAllUserStoryDetails", () => {
    it("should return a 201 response with the user story id", async () => {
      const response = await request(app)
        .get("/getAllUserStoryDetails")
        .set("Accept", "application/json")
        .send({
          username: "SERtestuser",
          password: "testuser",
          projectname:"testProject",
          userstoryname:"test US3"
      });
      expect(response.status).toBe(201);
      expect(response.body.parameters).toBeDefined();
    });
    it("should return a 500 response with the user story id", async () => {
      const response = await request(app)
        .get("/getAllUserStoryDetails")
        .set("Accept", "application/json")
        .send({
          username: "SERtestuser",
          password: "testuser",
          projectname:"testProject",
          userstoryname:"test USTest"
      });
      expect(response.status).toBe(500);
    });
  });

  describe("PATCH /updateUserStory", () => {
    it("should return a 201 response with an error message if user story is not created", async () => {
      const response = await request(app)
        .patch("/updateUserstory")
        .set("Accept", "application/json")
        .send({ username: "SERtestuser",
                password: "testuser",
                projectname:"testProject",
                userstoryname:"test US3",
                tags:["New-Feature"],
                points: {
                    "UX": "1",
                    "Back": "8",
                    "Front":"5"
            } 
          });
      expect(response.status).toBe(201);
    });
  });
});
