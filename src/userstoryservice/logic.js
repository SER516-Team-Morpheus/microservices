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

// Function to update user story
async function updateUserstory(userstoryId, parameters, token) {
  try {
    const USERSTORY_UPDATE_API_URL = USERSTORY_API_URL + "/" + userstoryId
    const response = await axios.patch(
      USERSTORY_UPDATE_API_URL,
        parameters
      ,
      { headers: { Authorization: `Bearer ${token}`} }
    );
    console.log("_______________");
    console.log(response);
    if (response.data.id) {
      return {
        success: true,
        message: `User Story with ${userstoryId} successfully updates`,
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
  updateUserstory
};
