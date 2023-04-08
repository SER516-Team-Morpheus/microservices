const axios = require('axios')
require('dotenv').config({ path: '../.env' })

const MEMBER_API_URL = `${process.env.TAIGA_API_BASE_URL}/memberships`

const AUTH_URL = `${process.env.AUTHENTICATE_URL}`
const AUTH_API_URL = `${process.env.TAIGA_API_BASE_URL}/auth`

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

// Function to get the roles
async function getRoleId (username, password, projectId) {
  const response1 = await axios.post(AUTH_API_URL, {
    type: 'normal',
    username,
    password
  })
  const authToken = response1.data.auth_token
  const ROLES_API_URL = `${process.env.TAIGA_API_BASE_URL}/roles?project=${projectId}`
  try {
    const response = await axios.get(ROLES_API_URL, {
      headers: { Authorization: `Bearer ${authToken}` }
    })
    const firstObject = response.data[0]
    return { roleID: firstObject.id, token: authToken }
  } catch (error) {
    return { success: false, message: 'Error getting roles' }
  }
}

// Function to create new member
async function createMember (username, project, role, token) {
  try {
    const response = await axios.post(
      MEMBER_API_URL,
      {
        project,
        role,
        username
      },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    if (response.data.id) {
      return { success: true, memberId: response.data.id }
    } else {
      return {
        success: false,
        message: 'Something went wrong while creating a member'
      }
    }
  } catch (error) {
    return { success: false, message: 'Error creating member' }
  }
}

async function getMembers (username, password, projectId) {
  const response1 = await axios.post(AUTH_API_URL, {
    type: 'normal',
    username,
    password
  })
  const token = response1.data.auth_token
  const MEMBERS_API_URL = `${MEMBER_API_URL}?project=${projectId}`
  try {
    const response = await axios.get(MEMBERS_API_URL, {
      headers: { Authorization: `Bearer ${token}` }
    })

    return { success: true, data: response.data }
  } catch (error) {
    return { success: false, message: 'Error getting roles' }
  }
}
// Function to delete a member
async function deleteMember (memberId, projectId, token) {
  const MEMBER_API_URL = `${process.env.TAIGA_API_BASE_URL}/memberships/${memberId}`
  try {
    const response = await axios.delete(
      MEMBER_API_URL,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    return { success: true, data: response.data }
  } catch (error) {
    return { success: false, message: error.message }
  }
}

// Function to update a member role
async function updateMember (username, password, roleId, memberId) {
  const response1 = await axios.post(AUTH_API_URL, {
    type: 'normal',
    username,
    password
  })
  const authToken = response1.data.auth_token
  const MEMBER_API_URL = `${process.env.TAIGA_API_BASE_URL}/memberships/${memberId}`
  try {
    const response = await axios.patch(
      MEMBER_API_URL,
      {
        role: roleId
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        }
      }
    )

    return { success: true, data: response.data }
  } catch (error) {
    return { success: false, message: 'Error editing member role' }
  }
}

module.exports = {
  getRoleId,
  createMember,
  getToken,
  getMembers,
  deleteMember,
  updateMember
}
