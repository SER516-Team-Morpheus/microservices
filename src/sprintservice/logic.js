const axios = require('axios')
require('dotenv').config({ path: '../.env' })

const taigaBaseUrl = 'https://api.taiga.io/api/v1'

const TOKEN_API_URL = taigaBaseUrl + '/auth'

const PROJECT_URL = `${process.env.GET_PROJECT_BY_SLUG_URL}`

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
    } else {
      return { auth_token: 'NULL' }
    }
  } catch (error) {
    return { auth_token: 'NULL' }
  }
}

async function getProjectID (username, password, name) {
  name = name.replace(/\s+/g, '-')
  try {
    const URL = `${PROJECT_URL}?username=${username}&password=${password}&name=${name}`
    const response = await axios.get(URL, {})
    if (response.data.projectId) {
      return response.data.projectId
    } else {
      return null
    }
  } catch (error) {
    return null
  }
}

async function getSprintByName (sprintName, token, projectID) {
  try {
    const sprints = await getAllSprints(token, projectID)
    const foundSprint = sprints.find(sprint => sprint.name === sprintName)
    if (foundSprint) {
      return { sprint: foundSprint, success: true }
    } else {
      return {
        error: 'No Sprint By This Name: ' + sprintName,
        success: false
      }
    }
  } catch (error) {
    return error
  }
};

async function getAllSprints (token, projectId) {
  try {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
    const response = await axios.get(`${taigaBaseUrl}/milestones?project=${projectId}`, { headers })
    const sprints = response.data
    return sprints
  } catch (error) {
    throw new Error('Error retrieving sprints')
  }
}

async function getSprintById (token, sprintId) {
  try {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
    const response = await axios.get(`${taigaBaseUrl}/milestones/${sprintId}`, { headers })
    const sprint = response.data
    return sprint
  } catch (error) {
    throw new Error('Error retrieving sprint')
  }
}

async function createSprint (token, sprint) {
  try {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
    const response = await axios.post(`${taigaBaseUrl}/milestones`, sprint, { headers })
    return response.data
  } catch (error) {
    throw new Error('Error creating sprint')
  }
}

async function editSprint (token, sprintId, patch) {
  try {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
    const response = await axios.patch(`${taigaBaseUrl}/milestones/${sprintId}`, patch, { headers })
    return response.data
  } catch (error) {
    throw new Error('Error editing sprint')
  }
}

async function deleteSprint (token, sprintId) {
  try {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
    const response = await axios.delete(`${taigaBaseUrl}/milestones/${sprintId}`, { headers })
    return response.status
  } catch (error) {
    throw new Error(error.response.data._error_message)
  }
}

module.exports = {
  getProjectID,
  getSprintByName,
  getAllSprints,
  getSprintById,
  createSprint,
  deleteSprint,
  editSprint,
  getToken
}
