const axios = require('axios')
require('dotenv').config({ path: '../.env' })

const PROJECT_API_URL = `${process.env.TAIGA_API_BASE_URL}/projects`
const AUTH_URL = `${process.env.TAIGA_API_BASE_URL}/auth`
const MEMBER_URL = `${process.env.TAIGA_API_BASE_URL}/users/me`

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

// Function to get member id
async function getMember (token) {
  try {
    const response = await axios.get(MEMBER_URL, {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (response.data.id) {
      return {
        success: true,
        memberId: response.data.id
      }
    } else {
      return {
        success: false,
        message: 'No member found.'
      }
    }
  } catch (error) {
    return { success: false, message: error.response.data }
  }
}

// Function to get the list of project for a member
async function getProjectList (token, memberId) {
  const GET_MEMBER_PROJECT = PROJECT_API_URL + '?member=' + memberId
  try {
    const response = await axios.get(GET_MEMBER_PROJECT, {
      headers: { Authorization: `Bearer ${token}` }
    })

    const newResponse = []
    for (let i = 0; i < response.data.length; i++) {
      const { name, description } = response.data[i]
      newResponse.push({ name, description })
    }

    if (newResponse.length) {
      return {
        success: true,
        projects: newResponse
      }
    } else {
      return {
        success: false,
        message: 'Authentication issue.'
      }
    }
  } catch (error) {
    console.log(error)
    return { success: false, message: 'Error getting project details.' }
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

// Function to create new project
async function createProject (name, description, token) {
  try {
    const response = await axios.post(
      PROJECT_API_URL,
      {
        name,
        description,
        is_private: false
      },
      { headers: { Authorization: `Bearer ${token}` } }
    )

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
        message: 'Something went wrong will creating project'
      }
    }
  } catch (error) {
    return { success: false, message: 'Error creating project' }
  }
}

module.exports = {
  getProjectBySlug,
  getMember,
  getProjectList,
  createProject,
  getToken
}
