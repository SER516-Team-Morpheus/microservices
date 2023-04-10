const axios = require('axios')
require('dotenv').config({ path: '../.env' })

const USERSTORY_API_URL = `${process.env.TAIGA_API_BASE_URL}/userstories`
const AUTH_URL = `${process.env.TAIGA_API_BASE_URL}/auth`
const PROJECT_API_URL = `${process.env.TAIGA_API_BASE_URL}/projects`
const GET_USER_URL = `${process.env.TAIGA_API_BASE_URL}/users`

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

// Function to get the projects by slug name
async function getProjectBySlug (token, slugName) {
  const PROJECT_SLUG_URL = PROJECT_API_URL + '/by_slug?slug=' + slugName
  try {
    const response = await axios.get(PROJECT_SLUG_URL, {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (response.data.id) {
      return {
        success: true,
        projectId: response.data.id,
        projectName: response.data.name,
        slugName: response.data.slug,
        description: response.data.description
      }
    } else {
      return {
        success: false,
        message: 'No project found'
      }
    }
  } catch (error) {
    return { success: false, message: 'Error getting project by name' }
  }
}
// Function to create new user story
async function createUserstory (project, subject, token) {
  try {
    const response = await axios.post(
      USERSTORY_API_URL,
      {
        project,
        subject
      },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    if (response.data.id) {
      return {
        success: true,
        userstoryId: response.data.id,
        message: `${subject} successfully created.`
      }
    } else {
      return {
        success: false,
        message: 'Something went wrong while creating userstory'
      }
    }
  } catch (error) {
    console.error(error)
    return { success: false, message: 'Error creating userstory' }
  }
}

// Function to update user story
async function updateUserstory (userstoryId, parameters, token) {
  try {
    const USERSTORY_UPDATE_API_URL = USERSTORY_API_URL + '/' + userstoryId
    const response = await axios.patch(USERSTORY_UPDATE_API_URL, parameters, {
      headers: { Authorization: `Bearer ${token}` }
    })
    // console.log(response);
    if (response.data.id) {
      return {
        success: true,
        message: `User Story with id ${userstoryId} successfully updated`,
        userstoryId: response.data.id
      }
    } else {
      return {
        success: false,
        message: 'Something went wrong while updating userstory'
      }
    }
  } catch (error) {
    console.error(error)
    return { success: false, message: 'Error updating userstory' }
  }
}

// Function to get the user name from user id
async function getUserName (token, assignedTo) {
  const GET_USER_NAME_URL = GET_USER_URL + '/' + assignedTo
  try {
    const response = await axios.get(GET_USER_NAME_URL, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data.full_name
  } catch (error) {
    return error
  }
}

// Function to get the user story detail
async function getUserStory (token, projectId) {
  const GET_USER_STORY_URL = USERSTORY_API_URL + '?project=' + projectId
  try {
    const response = await axios.get(GET_USER_STORY_URL, {
      headers: { Authorization: `Bearer ${token}` }
    })
    const newResponse = []
    for (let i = 0; i < response.data.length; i++) {
      const { id, subject } = response.data[i]
      const status = response.data[i].status_extra_info.name
      let assignee = 'none'
      const assignedTo = response.data[i].assigned_to

      if (assignedTo) {
        assignee = await getUserName(token, assignedTo)
      }

      newResponse.push({ id, subject, status, assignee })
    }
    if (newResponse.length) {
      return {
        success: true,
        userStory: newResponse
      }
    } else {
      return {
        success: false,
        message: 'Authentication issue.'
      }
    }
  } catch (error) {
    return { success: false, message: 'Error getting user story names' }
  }
}

async function getUserStoryDetails (token, slugName, userstoryName) {
  try {
    const USERSTORY_DETAILS_API_URL =
      USERSTORY_API_URL + '?project__slug=' + slugName
    const response = await axios.get(USERSTORY_DETAILS_API_URL, {
      headers: { Authorization: `Bearer ${token}` }
    })

    const parameters = {}
    for (let i = 0; i < response.data.length; i++) {
      if (response.data[i].subject === userstoryName) {
        parameters.id = response.data[i].id
        parameters.version = response.data[i].version
        parameters.ref = response.data[i].ref
      }
    }
    if (parameters.id) {
      return {
        success: true,
        message: 'successfully fetched details',
        parameters
      }
    } else {
      return {
        success: false,
        message: 'User Story not found'
      }
    }
  } catch (error) {
    return { success: false, message: 'Error fetching userstories details' }
  }
}

module.exports = {
  createUserstory,
  updateUserstory,
  getToken,
  getUserStoryDetails,
  getProjectBySlug,
  getUserStory
}
