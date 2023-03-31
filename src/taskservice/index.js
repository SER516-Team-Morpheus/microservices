const express = require("express");
const { createTask } = require("./logic");

const app = express();
const port = 3003;

app.use(express.json());

// Endpoint for creating a new task
app.post("/createTask", async (req, res) => {
  const { project, user_story, subject, description } = req.body;
  const token = req.headers.authorization.split(" ")[1];
  const taskData = await createTask(project, user_story, subject, description, token);
  if (!taskData.success) {
    return res.status(500).send({
      taskData,
    });
  }
  return res.status(201).send(taskData);
});

// Start the server
app.listen(port, () => {
  console.log(`Task microservice running at http://localhost:${port}`);
});

module.exports = app;