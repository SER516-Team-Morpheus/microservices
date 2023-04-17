const dotenv = require('dotenv')
dotenv.config({ path: '../.env' })
const axios = require('axios')
require('dotenv').config({ path: '../.env' })

const ROLE_API_URL = `${process.env.TAIGA_API_BASE_URL}/roles`
const AUTH_URL = `${process.env.TAIGA_API_BASE_URL}/auth`
const PROJECT_URL = `${process.env.TAIGA_API_BASE_URL}/projects`

// Function to get auth token from authenticate api
async function getToken(username, password) {
  try {
    const response = await axios.post(AUTH_URL, {
      type: 'normal',
      username,
      password,
    })
    if (response.data.auth_token) {
      return response.data.auth_token
    }
    return { auth_token: 'NULL' }
  } catch (error) {
    return { auth_token: 'NULL' }
  }
}

// Function to get the roles by slug name
async function getAllRoles(token, slugName) {
  const ROLE_SLUG_URL = PROJECT_URL + '/by_slug?slug=' + slugName
  try {
    const response = await axios.get(ROLE_SLUG_URL, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const rolesArray = response.data.roles
    const newResponse = []
    for (let i = 0; i < rolesArray.length; i++) {
      const roleId = rolesArray[i].id
      const roleName = rolesArray[i].name
      newResponse.push({ roleId, roleName })
    }
    if (newResponse.length) {
      return {
        success: true,
        projectId: response.data.id,
        roles: newResponse,
      }
    } else {
      return {
        success: false,
        message: 'No roles found.',
      }
    }
  } catch (error) {
    return { success: false, message: 'Error getting roles' }
  }
}

// Function to create new roles in a project
async function createRoles(token, name, project) {
  try {
    const response = await axios.post(
      ROLE_API_URL,
      {
        name,
        project,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    if (response.data.id) {
      return {
        success: true,
        roleId: response.data.id,
        roleName: response.data.name,
        message: `Role ${response.data.name} successfully created.`,
      }
    } else {
      return {
        success: false,
        message: 'Something went wrong while creating role',
      }
    }
  } catch (error) {
    return { success: false, message: 'Error creating roles' }
  }
}

// Function to update role name
async function updateRole(token, roleId, newRoleName) {
  const UPDATE_ROLE_API_URL = ROLE_API_URL + '/' + roleId
  try {
    const response = await axios.patch(
      UPDATE_ROLE_API_URL,
      {
        name: newRoleName,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    if (response.data.id) {
      return {
        success: true,
        roleId: response.data.id,
        roleName: response.data.name,
        message: `Role ${response.data.name} successfully updated.`,
      }
    } else {
      return {
        success: false,
        message: 'Something went wrong while updating role',
      }
    }
  } catch (error) {
    return { success: false, message: 'Error updating role' }
  }
}

// get roles details
async function getRoleDetails(roleId, token) {
  const ROLE_DETAILS_API_URL = ROLE_API_URL + '/' + roleId
  const response = await fetch(ROLE_DETAILS_API_URL, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const errorMessage = `Failed to get role: ${response.statusText}`
    throw new Error(errorMessage)
  }

  const role = await response.json()

  return role
}

// get roles details
async function deleteRole(token, roleId) {
  const DELETE_ROLE_API_URL = ROLE_API_URL + '/' + roleId
  try {
    const response = await axios.delete(DELETE_ROLE_API_URL, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    if (response.status === 204) {
      return {
        success: true,
        message: 'Role successfully deleted.',
      }
    } else {
      return {
        success: false,
        message: 'Something went wrong while deleting role',
      }
    }
  } catch (error) {
    return { success: false, message: 'Error deleting  role' }
  }
}

module.exports = {
  getToken,
  createRoles,
  getRoleDetails,
  getAllRoles,
  updateRole,
  deleteRole,
}
