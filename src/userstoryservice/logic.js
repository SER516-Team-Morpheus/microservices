const axios = require("axios");
require("dotenv").config({ path: "../.env" });

const USERSTORY_API_URL = `${process.env.TAIGA_API_BASE_URL}/userstories`;
const TOKEN_API_URL = `${process.env.TAIGA_API_BASE_URL}/auth`;

//Function to get auth token from authenticate api
async function getToken(username, password) {
  try {
    const response = await axios.post(TOKEN_API_URL, {
      type: "normal",
      username,
      password,
    });
    if (response.data.auth_token) {
      return response.data.auth_token;
    } else {
      return { auth_token: "NULL" };
    }
  } catch (error) {
    return { auth_token: "NULL" };
  }
}

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
   // console.log(response);
    if (response.data.id) {
      return {
        success: true,
        message: `User Story with id ${userstoryId} successfully updated`,
        userstoryId: response.data.id,
      };
    } else {
      return {
        success: false,
        message: "Something went wrong while updating userstory",
      };
    }
  } catch (error) {
    console.error(error);
    return { success: false, message: "Error updating userstory" };
  }
}


async function getUserStoryDetails(token, slugName, userstoryName){

  try {
    const USERSTORY_DETAILS_API_URL = USERSTORY_API_URL + "?project__slug=" + slugName
    const response = await axios.get(
      USERSTORY_DETAILS_API_URL,
      { headers: { Authorization: `Bearer ${token}`} }
    );
      
      var parameters = {};
      for (let i = 0; i < response.data.length; i++) {
        if(response.data[i].subject === userstoryName)
        {
          parameters.id = response.data[i].id;
          parameters.version = response.data[i].version;
          parameters.ref = response.data[i].ref;

        }

      }
      if(parameters.id)
      {
        return {
          success: true,
          message: `successfully fetched details`,
          parameters
        };
      }
      else
      {
        return {
          success: false,
          message: "User Story not found",
        };
        }
  }
  catch(error)
  {
    return { success: false, message: "Error fetching userstories details" };
  }

}


module.exports = {
  createUserstory,
  updateUserstory,
  getToken,
  getUserStoryDetails
};
