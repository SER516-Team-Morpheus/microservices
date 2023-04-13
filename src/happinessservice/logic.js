const axios = require("axios");
require("dotenv").config({ path: "../.env" });

const PROJECT_API_URL = `${process.env.TAIGA_API_BASE_URL}/userstory-custom-attributes`;


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
