const axios = require("axios");
require("dotenv").config({ path: "../.env" });

const PROJECT_API_URL = `${process.env.TAIGA_API_BASE_URL}/projects`;

// Function to get the projects
async function getProject(token) {
  try {
    const response = await axios.get(PROJECT_API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return { success: false, message: "Error creating project" };
  }
}

// Function to get the projects by ID
async function getProject(token) {
  try {
    const response = await axios.get(PROJECT_API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return { success: false, message: "Error creating project" };
  }
}

// Function to create new project
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

module.exports = {
  getProject,
  createProject,
};
