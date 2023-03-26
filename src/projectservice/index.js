const express = require("express");
const axios = require("axios");

const app = express();
const port = 3001;

const PROJECT_API_URL = "https://api.taiga.io/api/v1/projects";
app.use(express.json());

async function createProject(name, description, token) {
  try {
    const response = await axios.post(
      PROJECT_API_URL,
      {
        name,
        description,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (response.data.id) {
      return { success: true, projectId: response.data.id };
    } else {
      return {
        success: false,
        message: "Something went wrong will creating project",
      };
    }
  } catch (error) {
    console.error(error);
    return { success: false, message: "Error creating project" };
  }
}

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
  return res.send(projectData);
});

// Start the server
app.listen(port, () => {
  console.log(
    `Create Project microservice running at http://localhost:${port}`
  );
});
