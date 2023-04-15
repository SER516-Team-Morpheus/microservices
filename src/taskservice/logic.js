const axios = require('axios')
require('dotenv').config({ path: '../.env' })

const TASK_API_URL = `${process.env.TAIGA_API_BASE_URL}/tasks`
const TOKEN_API_URL = `${process.env.TAIGA_API_BASE_URL}/auth`
const USERSTORY_API_URL = `${process.env.TAIGA_API_BASE_URL}/userstories`

// Function to get auth token from authenticate api
async function getToken (username, password) {
  try {
    const response = await axios.post(TOKEN_API_URL, {
      type: 'normal',
      username,
      password
    })
    if (response.data.auth_token) {
      return response.data.auth_token
    }
    return { auth_token: 'NULL' }
  } catch (error) {
    return { auth_token: 'NULL' }
  }
}

async function getUserStoryDetails (token, slugName, userstoryName) {
  try {
    const USERSTORY_DETAILS_API_URL = `${USERSTORY_API_URL}?project__slug=${slugName}`
    const response = await axios.get(
      USERSTORY_DETAILS_API_URL,
      { headers: { Authorization: `Bearer ${token}` } }
    )

    const parameters = {}
    for (let i = 0; i < response.data.length; i += 1) {
      if (response.data[i].subject === userstoryName) {
        parameters.id = response.data[i].id
        parameters.version = response.data[i].version
        parameters.ref = response.data[i].ref
        parameters.projectid = response.data[i].project
      }
    }
    if (parameters.id) {
      return {
        success: true,
        message: 'successfully fetched details',
        parameters
      }
    }

    return {
      success: false,
      message: 'User Story not found'
    }
  } catch (error) {
    return { success: false, message: 'Error fetching userstories details' }
  }
}

// eslint-disable-next-line camelcase
async function createTask (project, user_story, subject, token) {
  try {
    const response = await axios.post(
      TASK_API_URL,
      {
        project,
        // eslint-disable-next-line camelcase
        user_story,
        subject
      },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    if (response.data.id) {
      return {
        success: true,
        message: `Task ${subject} successfully created.`,
        taskId: response.data.id
      }
    }
    return {
      success: false,
      message: 'Something went wrong while creating task'
    }
  } catch (error) {
    return { success: false, message: 'Error creating task' }
  }
}

async function getTaskDetails (token, slugName, userstoryName, taskname) {
  try {
    const TASK_DETAILS_API_URL = `${TASK_API_URL}?project__slug=${slugName}`
    const response = await axios.get(
      TASK_DETAILS_API_URL,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    const parameters = {}
    for (let i = 0; i < response.data.length; i += 1) {
      if (response.data[i].user_story_extra_info.subject === userstoryName) {
        if (response.data[i].subject === taskname) {
          parameters.id = response.data[i].id
          parameters.taskName = response.data[i].subject
          parameters.user_story = response.data[i].user_story
          parameters.version = response.data[i].version
          parameters.user_story_extra_info = response.data[i].user_story_extra_info
          parameters.status_extra_info = response.data[i].status_extra_info
          parameters.assigned_to = response.data[i].assigned_to
          if (response.data[i].status_extra_info.name.toLowerCase() === 'new') {
            parameters.status_id = response.data[i].status
          } else if (response.data[i].status_extra_info.name.toLowerCase() === 'in progress') {
            parameters.status_id = response.data[i].status - 1
          } else if (response.data[i].status_extra_info.name.toLowerCase() === 'ready for test') {
            parameters.status_id = response.data[i].status - 2
          } else if (response.data[i].status_extra_info.name.toLowerCase() === 'closed') {
            parameters.status_id = response.data[i].status - 3
          } else if (response.data[i].status_extra_info.name.toLowerCase() === 'needs info') {
            parameters.status_id = response.data[i].status - 4
          } else if (response.data[i].status_extra_info.name.toLowerCase() === 'done') {
            parameters.status_id = response.data[i].status - 5
          }
        }
      }
    }
    if (parameters.id) {
      return {
        success: true,
        message: 'successfully fetched details',
        parameters
      }
    }

    return {
      success: false,
      message: 'Task not found'
    }
  } catch (error) {
    return { success: false, message: 'Error fetching task' }
  }
}

async function getUserStoryTasksDetails (token, slugName, userstoryName) {
  try {
    const TASK_DETAILS_API_URL = `${TASK_API_URL}?project__slug=${slugName}`
    const response = await axios.get(
      TASK_DETAILS_API_URL,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    const parameters = []
    for (let i = 0; i < response.data.length; i += 1) {
      const taskDetails = {}
      if (response.data[i].user_story_extra_info.subject === userstoryName) {
        taskDetails.taskId = response.data[i].id
        taskDetails.taskName = response.data[i].subject
        taskDetails.user_story = response.data[i].user_story
        taskDetails.version = response.data[i].version
        taskDetails.user_story_extra_info = response.data[i].user_story_extra_info
        taskDetails.status_extra_info = response.data[i].status_extra_info
        taskDetails.assigned_to_extra_info = response.data[i].assigned_to_extra_info
      }
      if (Object.keys(taskDetails).length !== 0) {
        parameters.push(taskDetails)
      }
    }
    if (parameters.length !== 0) {
      return {
        success: true,
        message: 'Task details fetched successfully',
        details: parameters
      }
    } else {
      return {
        success: true,
        message: 'No Task Found for given user story',
        details: parameters
      }
    }
  } catch (error) {
    return { success: false, message: 'Error fetching tasks for given user story' }
  }
}

async function updateTaskDetails (token, taskId, parameters) {
  try {
    const TASK_UPDATE_API_URL = `${TASK_API_URL}/${taskId}`
    const response = await axios.patch(TASK_UPDATE_API_URL, parameters, {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (response.data.id) {
      return {
        success: true,
        message: `Task with id ${taskId} successfully updated`,
        taskId: response.data.id
      }
    }
    return {
      success: false,
      message: 'Something went wrong while updating task'
    }
  } catch (error) {
    return { success: false, message: 'Error updating the task' }
  }
}

async function deleteTask (token, taskId) {
  try {
    const TASK_DELETE_API_URL = `${TASK_API_URL}/${taskId}`
    const response = await axios.delete(TASK_DELETE_API_URL, {
      headers: { Authorization: `Bearer ${token}` }
    })
    // eslint-disable-next-line eqeqeq
    if (response.status == 204) {
      return {
        success: true,
        message: `Task with id ${taskId} successfully deleted`,
        taskId
      }
    }
    return {
      success: false,
      message: 'Something went wrong while deleting task'
    }
  } catch (error) {
    return { success: false, message: 'Error deleting the task' }
  }
}

module.exports = {
  createTask,
  getToken,
  getUserStoryDetails,
  getTaskDetails,
  updateTaskDetails,
  deleteTask,
  getUserStoryTasksDetails
}
