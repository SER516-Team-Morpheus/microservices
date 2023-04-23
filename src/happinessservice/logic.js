const axios = require("axios");
require("dotenv").config({ path: "../.env" });

const PROJECT_API_URL = `${process.env.TAIGA_API_BASE_URL}/userstory-custom-attributes`;
const AUTH_URL = `${process.env.TAIGA_API_BASE_URL}/auth`

// Function to get auth token from authenticate api
async function getToken (username, password) {
  try {
    const response = await axios.post(AUTH_URL, {
      type: 'normal',
      username,
      password
    })
    if (response.data.auth_token) {
      return response.data.auth_token
    } else {
      return { auth_token: 'NULL' }
    }
  } catch (error) {
    return { auth_token: 'NULL' }
  }
}

async function AddHappiness(name, project, token) {
  try {
    const response = await axios.post(
      PROJECT_API_URL,
      {
        name,
        project,
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
  AddHappiness
};
