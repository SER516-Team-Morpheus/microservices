const axios = require("axios");
require("dotenv").config({ path: "../.env" });

const MEMBER_API_URL = `${process.env.TAIGA_API_BASE_URL}/memberships`;

const AUTH_URL = `${process.env.AUTHENTICATE_URL}`;

//Function to get auth token from authenticate api
async function getToken(username, password) {
  try {
    const response = await axios.post(AUTH_URL, {
      type: "normal",
      username,
      password,
    });
    if (response.data.token) {
      return response.data.token;
    } else {
      return { auth_token: "NULL" };
    }
  } catch (error) {
    return { auth_token: "NULL" };
  }
}

// Function to get the roles
async function getRoleId(token, projectId) {
    const ROLES_API_URL = `${process.env.TAIGA_API_BASE_URL}/roles?project=${projectId}`;
    try {
      const response = await axios.get(ROLES_API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const firstObject = response.data[0];
      return firstObject.id;
    } catch (error) {
      return { success: false, message: "Error getting roles" };
    }
  }

// Function to create new member
async function createMember(username, project, role, token) {
    try {
      const response = await axios.post(
        MEMBER_API_URL,
        {
          project,
          role,
          username,
        },
        { headers: { Authorization: `Bearer ${token}` }  }
      );
      if (response.data.id) {
        return { success: true, memberId: response.data.id };
      } else {
        return {
          success: false,
          message: "Something went wrong while creating a member",
        };
      }
    } catch (error) {
      return { success: false, message: "Error creating member" };
    }
  }

async function getMembers(token, projectId){
  const MEMBERS_API_URL = `${MEMBER_API_URL}?project=${projectId}`;
  try {
    const response = await axios.get(MEMBERS_API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, message: "Error getting roles" };
  }
}
  
  module.exports = {
    getRoleId,
    createMember,
    getToken,
    getMembers,
  };