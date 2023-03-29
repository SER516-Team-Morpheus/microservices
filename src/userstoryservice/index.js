const express = require("express");
const { createUserstory } = require("./logic");

const app = express();
const port = 3003;

app.use(express.json());

// Endpoint for creating a new user story
app.post("/createUserstory", async (req, res) => {
  const { project, subject } = req.body;
  const token = req.headers.authorization.split(" ")[1];
  const userstoryData = await createUserstory(project, subject, token);
  if (!userstoryData.success) {
    return res.status(500).send({
      userstoryData,
    });
  }
  return res.status(201).send(userstoryData);
});

// Start the server
app.listen(port, () => {
  console.log(`User story microservice running at http://localhost:${port}`);
});

module.exports = app;
