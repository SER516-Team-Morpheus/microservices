const axios = require("axios");
require("dotenv").config({ path: "../.env" });

const TASK_API_URL = `${process.env.TAIGA_API_BASE_URL}/tasks`;

async function createTask(project, user_story, subject, description, token) {
  try {
    const response = await axios.post(
      TASK_API_URL,
      {
        project,
        user_story,
        subject,
        description,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (response.data.id) {
      return {
        success: true,
        message: `${subject} successfully created.`,
        taskId: response.data.id,
      };
    } else {
      return {
        success: false,
        message: "Something went wrong while creating task",
      };
    }
  } catch (error) {
    console.error(error);
    return { success: false, message: "Error creating task" };
  }
}

module.exports = {
  createTask,
};