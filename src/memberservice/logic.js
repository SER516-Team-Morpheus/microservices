const axios = require("axios");
require("dotenv").config({ path: "../.env" });

const MEMBER_API_URL = `${process.env.TAIGA_API_BASE_URL}/memberships`;


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
      console.error(error);
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
        { headers: { Authorization: `Bearer ${token}` } }
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
      console.error(error);
      return { success: false, message: "Error creating member" };
    }
  }
  
  module.exports = {
    getRoleId,
    createMember,
  };