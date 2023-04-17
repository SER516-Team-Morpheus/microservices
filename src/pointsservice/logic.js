const axios = require('axios')
require('dotenv').config({ path: '../.env' })

const AUTH_URL = `${process.env.TAIGA_API_BASE_URL}/auth`
const PROJECT_URL = `${process.env.TAIGA_API_BASE_URL}/projects`
const POINTS_URL = `${process.env.TAIGA_API_BASE_URL}/points`

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

// Function to get the projectData
async function getProjectData (token, slugName) {
  const PROJECT_SLUG_URL = PROJECT_URL + '/by_slug?slug=' + slugName
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

// Function to get the points for the project
async function getPointsData (token, projectId) {
  const PROJECT_POINTS_URL = POINTS_URL + '?project=' + projectId
  try {
    const response = await axios.get(PROJECT_POINTS_URL, {
      headers: { Authorization: `Bearer ${token}` }
    })

    const data = response.data
    if (response.data.length) {
      return {
        success: true,
        data
      }
    } else {
      return {
        success: true,
        data,
        message: 'No points defined for the project'
      }
    }
  } catch (error) {
    return { success: false, message: 'Error getting points for the project' }
  }
}

// Function to create the points for the project
async function createPointsData (token, project, value) {
  try {
    const response = await axios.post(
      POINTS_URL,
      {
        name: value,
        project,
        value
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    )
    if (response.data.id) {
      return {
        success: true,
        pointsId: response.data.id,
        pointsName: response.data.name,
        pointsValue: response.data.value,
        pointsOrder: response.data.order,
        message: 'Points created successfully'
      }
    } else {
      return {
        success: false,
        message: 'Points wwas not created due to some issue.'
      }
    }
  } catch (error) {
    return { success: false, message: 'Error creating points for the project' }
  }
}

module.exports = {
  getToken,
  getProjectData,
  getPointsData,
  createPointsData
}
