const axios = require("axios");
require("dotenv").config({ path: "../.env" });

const USERSTORY_API_URL = `${process.env.TAIGA_API_BASE_URL}/userstories`;

// Function to create new user story
async function createUserstory(project, subject, token) {
  try {
    const response = await axios.post(
      USERSTORY_API_URL,
      {
        project,
        subject,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (response.data.id) {
      return {
        success: true,
        message: `${subject} successfully created.`,
        userstoryId: response.data.id,
      };
    } else {
      return {
        success: false,
        message: "Something went wrong while creating userstory",
      };
    }
  } catch (error) {
    console.error(error);
    return { success: false, message: "Error creating userstory" };
  }
}

module.exports = {
  createUserstory,
};
