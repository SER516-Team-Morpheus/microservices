//This will have the logic of the endpoints.

const axios = require("axios");
require("dotenv").config({ path: "../.env" });

const ROLE_API_URL = `${process.env.TAIGA_API_BASE_URL}/roles`;

//create new roles
async function createRoles(name, token)
{
    try {   
        const response = await axios.post(
            ROLE_API_URL,
          {
            name,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data.id) {
          return {
            success: true,
            message: `${name} role successfully created.`,
            userstoryId: response.data.id,
          };
        } else {
          return {
            success: false,
            message: "Something went wrong while creating role",
          };
        }
        }catch (error) {
        console.error(error);
        return { success: false, message: "Error creating role" };
    }
}



//update roles
async function updateRole(roleId, parameters, token) {
    try {
        const ROLE_UPDATE_API_URL = ROLE_API_URL + "/" + roleId;
        const response = await axios.patch(
        ROLE_UPDATE_API_URL,
        parameters,
        { headers: { Authorization: `Bearer ${token}`} }
        );
        if (response.data.id) {
        return {
            success: true,
            message: `Role with ${roleId} successfully updated`,
            roleId: response.data.id,
        };
        } else {
        return {
            success: false,
            message: "Something went wrong while updating role",
        };
        }
    } catch (error) {
        console.error(error);
        return { success: false, message: "Error updating role" };
    }
}

//get roles details
async function getRoleDetails(token, slugName, roleName){

    try {
      const ROLE_DETAILS_API_URL = ROLE_API_URL + "?project__slug=" + slugName
      const response = await axios.get(
        ROLE_DETAILS_API_URL,
        { headers: { Authorization: `Bearer ${token}`} }
      );
        
      const role = response.data.find(r => r.name === roleName);
    
      if (role) {
        return {
          success: true,
          message: `${roleName} role successfully fetched.`,
          role,
        };
      } else {
        return {
          success: false,
          message: `${roleName} role not found in the ${projectSlug} project.`,
        };
      }
    } catch (error) {
      console.error(error);
      return { success: false, message: "Error fetching role details" };
    }
  
}
    
module.exports = {
    createRoles,
    updateRole,
    getRoleDetails,
  };