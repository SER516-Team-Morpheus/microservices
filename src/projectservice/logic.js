const axios = require('axios')
require('dotenv').config({ path: '../.env' })

const PROJECT_API_URL = `${process.env.TAIGA_API_BASE_URL}/projects`
const AUTH_URL = `${process.env.AUTHENTICATE_URL}`

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

// Function to delete project
async function deleteProject (projectID, token) {
  try {
    const DELETE_URL = PROJECT_API_URL + '/' + projectID
    const response = await axios.delete(
      DELETE_URL,
      { headers: { Authorization: `Bearer ${token}` } }
    )

    // eslint-disable-next-line eqeqeq
    if (response.status == 204) {
      return {
        success: true,
        message: 'Project Deleted Successfully'
      }
    } else {
      return {
        success: false,
        message: 'Something went wrong will deleting project'
      }
    }
  } catch (error) {
    return { success: false, message: 'Error deleting project' }
  }
}

//
async function editProject (token, projectID, patch) {
  try {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
    const response = await axios.patch(`${PROJECT_API_URL}/${projectID}`, patch, { headers })
    // eslint-disable-next-line eqeqeq
    if (response.status == 200) {
      return {
        status: 'success',
        data: response.data
      }
    }
    console.log(response.status)
    return response.data
  } catch (error) {
    throw new Error('Error editing project')
  }
}
module.exports = {
  getProjectBySlug,
  createProject,
  getToken,
  deleteProject,
  editProject
}
