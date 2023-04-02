const express = require("express");
const { getToken, getProjectBySlug, createProject } = require("./logic");

const app = express();
const port = 3002;

app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});

//Endpoint for getting project by slug name
app.get("/getProjectBySlug", async (req, res) => {
  const { username, password, name } = req.query;
  const token = await getToken(username, password);
  const slugName = `${username.toLowerCase()}-${name.toLowerCase()}`;
  const projectData = await getProjectBySlug(token, slugName);
  if (!projectData.success) {
    return res.status(404).send(projectData);
  }
  return res.send(projectData);
});

// Endpoint for creating a new project
app.post("/createProject", async (req, res) => {
  const { username, password, name, description } = req.body;
  const token = await getToken(username, password);
  const slugName = username.toLowerCase() + "-" + name.toLowerCase();
  const checkProjectName = await getProjectBySlug(token, slugName);
  if (!checkProjectName.success) {
    const projectData = await createProject(name, description, token);
    if (!projectData.success) {
      return res.status(500).send(projectData);
    }
    return res.status(201).send(projectData);
  }
  return res.status(500).send({
    success: false,
    message: "Same project name already exist!",
    sol: "Try different project name.",
  });
});

// Start the server
app.listen(port, () => {
  console.log(
    `Create Project microservice running at http://localhost:${port}`
  );
});

module.exports = app;
