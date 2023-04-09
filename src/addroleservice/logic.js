const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });
// This will have the logic of the endpoints.
//const fetch = require("node-fetch");
const axios = require("axios");
//const dotenv = import("dotenv");

require('dotenv').config({ path: '../.env' });

const ROLE_API_URL = `${process.env.TAIGA_API_BASE_URL}/roles`;
const AUTH_URL = `${process.env.AUTHENTICATE_URL}`;

// Function to get auth token from authenticate api
async function getToken(username, password) {
  try {
    const response = await axios.post(AUTH_URL, {
      type: 'normal',
      username,
      password,
    });
    if (response.data.token) {
      return response.data.token;
    }
    return { auth_token: 'NULL' };
  } catch (error) {
    return { auth_token: 'NULL' };
  }
}

// create new roles
async function createRoles(name, project, order, computable, permissions, token) {
  const data = {
    name,
    project,
    order,
    computable,
    permissions,
  };

  const response = await fetch(ROLE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorMessage = `Failed to create role: ${response.statusText}`;
    throw new Error(errorMessage);
  }

  const role = await response.json();

  return role;
}

// update roles
async function updateRole(roleId, name, order, computable, permissions, token) {
  const ROLE_UPDATE_API_URL = ROLE_API_URL + "/" + roleId;
  const data = {};

  if (name) {
    data.name = name;
  }

  if (order !== undefined) {
    data.order = order;
  }

  if (computable !== undefined) {
    data.computable = computable;
  }

  if (permissions) {
    data.permissions = permissions;
  }

  const response = await fetch(ROLE_UPDATE_API_URL, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorMessage = `Failed to update role: ${response.statusText}`;
    throw new Error(errorMessage);
  }

  const role = await response.json();

  return role;
}

// get roles details
async function getRoleDetails(roleId, token) {
  const ROLE_DETAILS_API_URL = ROLE_API_URL + "/" + roleId;
  const response = await fetch(ROLE_DETAILS_API_URL, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorMessage = `Failed to get role: ${response.statusText}`;
    throw new Error(errorMessage);
  }

  const role = await response.json();

  return role;
}

module.exports = {
  createRoles,
  updateRole,
  getRoleDetails,
};