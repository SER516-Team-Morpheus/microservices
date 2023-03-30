const express = require("express");
const { createMember,getRoleId } = require("./logic");

const app = express();
const port = 3004;

app.use(express.json());

// Endpoint for creating a new member
app.post("/createMember", async (req, res) => {
    const { username, projectId } = req.body;
    const token = req.headers.authorization.split(" ")[1];
    const roleId = await getRoleId(token, projectId);
    const memberData = await createMember(username, projectId, roleId, token);
    if (!memberData.success) {
      return res.status(500).send({
        success: false,
        message: "Error creating member",
      });
    }
    return res.status(201).send(memberData);
  });
  
  // Start the server
  app.listen(port, () => {
    console.log(
      `Create Member microservice running at http://localhost:${port}`
    );
  });
  
  module.exports = app;