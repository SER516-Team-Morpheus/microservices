const axios = require("axios");
// require("dotenv").config({ path: "../.env" });

const taigaBaseUrl = 'https://api.taiga.io/api/v1';

async function getAllSprints(token, projectId) {
  try {
    const headers = {
      'Authorization': `Bearer ${token}`
    };
    const response = await axios.get(`${taigaBaseUrl}/milestones?project=${projectId}`, { headers });
    const sprints = response.data;
    return sprints;
  } catch (error) {
    console.error(error);
    throw new Error('Error retrieving sprints');
  }
}

async function getSprintById(token, sprintId) {
  try {
    const headers = {
      'Authorization': `Bearer ${token}`
    };
    const response = await axios.get(`${taigaBaseUrl}/milestones/${sprintId}`, { headers });
    const sprint = response.data;
    return sprint;
  } catch (error) {
    console.error(error);
    throw new Error('Error retrieving sprint');
  }
}

async function createSprint(token, sprint) {
  try {
    const headers = {
      'Authorization': `Bearer ${token}`
    };
    const response = await axios.post(`${taigaBaseUrl}/milestones`, sprint, { headers });
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error('Error creating sprint');
  }
}

/*
Need to fix this.
*/
async function deleteSprint(token, sprintId) {
  try {
    const headers = {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${token}`
    };
    const response = await axios.delete(`${taigaBaseUrl}/milestones/${sprintId}`, { headers });
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error(error.response.data._error_message);
  }
}

module.exports = {
  getAllSprints,
  getSprintById,
  createSprint,
  deleteSprint
};
