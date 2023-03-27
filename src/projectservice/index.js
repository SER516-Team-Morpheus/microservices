const express = require("express");
const { getProject, createProject } = require("./logic");

const app = express();
const port = 3001;

app.use(express.json());

// Endpoint for getting all project
app.get("/getProject", async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const projectData = await getProject(token);
  const result = [];
  projectData.forEach((item) => {
    result.push({
      id: item.id,
      name: item.name,
    });
  });
  return res.send(result);
});

//Endpoint for getting project by ID
app.get("/getProjectById", async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const projectData = await getProjectById(token);
  const result = [];
  projectData.forEach((item) => {
    result.push({
      id: item.id,
      name: item.name,
    });
  });
  return res.send(result);
});

// Endpoint for creating a new project
app.post("/createProject", async (req, res) => {
  const { name, description } = req.body;
  const token = req.headers.authorization.split(" ")[1];
  const projectData = await createProject(name, description, token);
  if (!projectData.success) {
    return res.status(500).send({
      success: false,
      message: "Error creating project",
    });
  }
  return res.status(201).send(projectData);
});

// Start the server
app.listen(port, () => {
  console.log(
    `Create Project microservice running at http://localhost:${port}`
  );
});

module.exports = app;
