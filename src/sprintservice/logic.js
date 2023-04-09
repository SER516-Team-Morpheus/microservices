const axios = require('axios')

const taigaBaseUrl = 'https://api.taiga.io/api/v1'

const TOKEN_API_URL = taigaBaseUrl + '/auth'

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
  getAllSprints,
  getSprintById,
  createSprint,
  deleteSprint,
  editSprint,
  getToken
}
