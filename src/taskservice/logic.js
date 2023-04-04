const axios = require("axios");
require("dotenv").config({ path: "../.env" });

const TASK_API_URL = `${process.env.TAIGA_API_BASE_URL}/tasks`;
const TOKEN_API_URL = `${process.env.TAIGA_API_BASE_URL}/auth`;
const USERSTORY_API_URL = `${process.env.TAIGA_API_BASE_URL}/userstories`

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

async function getUserStoryDetails(token, slugName,userstoryName){
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
          parameters.projectid = response.data[i].project;

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

async function createTask(project, user_story, subject, token) {
  try {
    const response = await axios.post(
      TASK_API_URL,
      {
        project,
        user_story,
        subject
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (response.data.id) {
      return {
        success: true,
        message: `Tak ${subject} successfully created.`,
        taskId: response.data.id,
      };
    } else {
      return {
        success: false,
        message: "Something went wrong while creating task",
      };
    }
  } catch (error) {
    return { success: false, message: "Error creating task" };
  }
}

async function getTaskDetails(token, slugName, taskname){
  try{
    const TASK_DETAILS_API_URL = TASK_API_URL + "?project__slug=" + slugName
    const response = await axios.get(
                    TASK_DETAILS_API_URL,
                      { headers: { Authorization: `Bearer ${token}`} }
                    );
    var parameters = {};
    console.log(response.data.length);
    for (let i = 0; i < response.data.length; i++) {
      console.log(response.data[i].subject);
      if(response.data[i].subject === taskname)
        {
            parameters.id = response.data[i].id;
            parameters.user_story = response.data[i].user_story;

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
            message: "Task not found",
          };
          }

  }catch (error) {
    return { success: false, message: "Error fetching task" };
  }

}

module.exports = {
  createTask,
  getToken,
  getUserStoryDetails,
  getTaskDetails
};