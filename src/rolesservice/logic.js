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
        userStory: newResponse,
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

// create new roles
async function createRoles(
  name,
  project,
  order,
  computable,
  permissions,
  token
) {
  const data = {
    name,
    project,
    order,
    computable,
    permissions,
  }

  const response = await fetch(ROLE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const errorMessage = `Failed to create role: ${response.statusText}`
    throw new Error(errorMessage)
  }

  const role = await response.json()

  return role
}

// update roles
async function updateRole(roleId, name, order, computable, permissions, token) {
  const ROLE_UPDATE_API_URL = ROLE_API_URL + '/' + roleId
  const data = {}

  if (name) {
    data.name = name
  }

  if (order !== undefined) {
    data.order = order
  }

  if (computable !== undefined) {
    data.computable = computable
  }

  if (permissions) {
    data.permissions = permissions
  }

  const response = await fetch(ROLE_UPDATE_API_URL, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const errorMessage = `Failed to update role: ${response.statusText}`
    throw new Error(errorMessage)
  }

  const role = await response.json()

  return role
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

module.exports = {
  getToken,
  createRoles,
  updateRole,
  getRoleDetails,
  getAllRoles,
}
