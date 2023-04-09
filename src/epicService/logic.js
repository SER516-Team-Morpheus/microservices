const axios = require('axios')
require('dotenv').config({ path: '../.env' })

const EPIC_API_URL = `${process.env.TAIGA_API_BASE_URL}/epics`
const AUTH_URL = `${process.env.AUTHENTICATE_URL}`

// Function to get auth token from authenticate api
async function getToken (username, password) {
  try {
    const response = await axios.post(AUTH_URL, {
      type: 'normal',
      username,
      password
    })
    if (response.data.token) {
      return response.data.token
    } else {
      return { auth_token: 'NULL' }
    }
  } catch (error) {
    return { auth_token: 'NULL' }
  }
}

// Function to create new epic
async function createEpic (
  name,
  project,
  description,
  token,
  dueDate = null,
  watchers = []
) {
  try {
    const response = await axios.post(
      EPIC_API_URL,
      {
        subject: name,
        project,
        description
      },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    console.log(response.data)
    if (response.data.id) {
      return {
        success: true,
        epicId: response.data.id,
        epicName: response.data.subject,
        description: response.data.description
      }
    } else {
      return {
        success: false,
        message: 'Something went wrong while creating epic'
      }
    }
  } catch (error) {
    console.log(error)
    return { success: false, message: 'Error creating epic' }
  }
}

module.exports = {
  createEpic,
  getToken
}
