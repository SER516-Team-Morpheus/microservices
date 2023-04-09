const axios = require('axios')
require('dotenv').config({ path: '../.env' })

const USERSTORY_API_URL = `${process.env.TAIGA_API_BASE_URL}/userstories`
const AUTH_URL = `${process.env.TAIGA_API_BASE_URL}/auth`
const PROJECT_API_URL = `${process.env.TAIGA_API_BASE_URL}/projects`
const POINTS_API_URL = `${process.env.TAIGA_API_BASE_URL}/points`

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

// Function to get the projects by slug name
async function getUserStory (token, projectId) {
  const GET_USER_STORY_URL = USERSTORY_API_URL + '?project=' + projectId
  try {
    const response = await axios.get(GET_USER_STORY_URL, {
      headers: { Authorization: `Bearer ${token}` }
    })
    const newResponse = []
    for (let i = 0; i < response.data.length; i++) {
      const { id, subject } = response.data[i]
      newResponse.push({ id, subject })
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
        parameters.projectId = response.data[i].project
        const points = response.data[i].points
        parameters.point = Math.min(...Object.keys(points).map(Number))
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

async function getPointValues (token, projectId) {
  try {
    const PROJECT_POINTS_DETAILS_URL = POINTS_API_URL + '?project=' + projectId
    const response = await axios.get(PROJECT_POINTS_DETAILS_URL, {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (response.data.length > 0) {
      let pointValue = 0
      for (let i = 0; i < response.data.length; i += 1) {
        if (response.data[i].order === 1) {
          pointValue = response.data[i].id
          break
        }
      }
      return { success: true, message: 'found all the details', point_value: pointValue }
    } else {
      return { success: false, message: 'Not project found with given details' }
    }
  } catch (error) {
    return { success: false, message: 'Not able to fetch points' }
  }
}

module.exports = {
  createUserstory,
  updateUserstory,
  getToken,
  getUserStoryDetails,
  getProjectBySlug,
  getUserStory,
  getPointValues
}
