const axios = require("axios");
require("dotenv").config({ path: "../.env" });

const PROJECT_API_URL = `${process.env.TAIGA_API_BASE_URL}/projects`;
const TOKEN_API_URL = `${process.env.AUTHENTICATE_URL}`;

//Function to get auth token from authenticate api
async function getToken(username, password) {
  try {
    const response = await axios.post(TOKEN_API_URL, {
      type: "normal",
      username,
      password,
    });
    if (response.data.token) {
      return response.data.token;
    } else {
      return { auth_token: "NULL" };
    }
  } catch (error) {
    return { auth_token: "NULL" };
  }
}

// Function to get the projects by slug name
async function getProjectBySlug(token, slugName) {
  PROJECT_SLUG_URL = PROJECT_API_URL + "/by_slug?slug=" + slugName;
  try {
    const response = await axios.get(PROJECT_SLUG_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(response);
    if (response.data.id) {
      return {
        success: true,
        projectId: response.data.id,
        projectName: response.data.name,
        slugName: response.data.slug,
        description: response.data.description,
      };
    } else {
      return {
        success: false,
        message: "No project found",
      };
    }
  } catch (error) {
    return { success: false, message: "Error getting project by name" };
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
        is_private: false,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (response.data.id) {
      return {
        success: true,
        projectId: response.data.id,
        projectName: response.data.name,
        slugName: response.data.slug,
        description: response.data.description,
      };
    } else {
      return {
        success: false,
        message: "Something went wrong will creating project",
      };
    }
  } catch (error) {
    return { success: false, message: "Error creating project" };
  }
}

module.exports = {
  getProjectBySlug,
  createProject,
  getToken,
};
