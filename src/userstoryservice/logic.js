const axios = require('axios')
require('dotenv').config({ path: '../.env' })

const USERSTORY_API_URL = `${process.env.TAIGA_API_BASE_URL}/userstories`
const AUTH_URL = `${process.env.TAIGA_API_BASE_URL}/auth`
const PROJECT_API_URL = `${process.env.TAIGA_API_BASE_URL}/projects`
const POINTS_API_URL = `${process.env.TAIGA_API_BASE_URL}/points`
const GET_USER_URL = `${process.env.TAIGA_API_BASE_URL}/users`
const POINTS_URL = `${process.env.TAIGA_API_BASE_URL}/points`

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

async function moveUserStory(token, projectId, milestoneId, userStoryIds) {
  try {
    const MOVE_URL =  `${USERSTORY_API_URL}/bulk_update_backlog_order`
    const response = await axios.post(MOVE_URL,
      {
        project_id: projectId,
        bulk_userstories: userStoryIds,
        milestone_id: milestoneId,
      },  
      { headers: { Authorization: `Bearer ${token}` } }
    )
    if (response.data[0].id) {
      return {
        success: true,
        message: `User stories moved to sprint ${milestoneId}`,
      }
    } else {
      return {
        success: false,
        message: 'Something went wrong while moving user stories',
      }
    }
  } catch (error) {
    console.error(error)
    return { success: false, message: 'Error moving user stories' }
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
// Function to create new user story
async function createUserstory (project, subject, token) {
  try {
    const response = await axios.post(
      USERSTORY_API_URL,
      {
        project,
        subject
      },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    if (response.data.id) {
      return {
        success: true,
        userstoryId: response.data.id,
        message: `${subject} successfully created.`
      }
    } else {
      return {
        success: false,
        message: 'Something went wrong while creating userstory'
      }
    }
  } catch (error) {
    console.error(error)
    return { success: false, message: 'Error creating userstory' }
  }
}

// Function to update user story
async function updateUserstory (userstoryId, parameters, token) {
  try {
    const USERSTORY_UPDATE_API_URL = USERSTORY_API_URL + '/' + userstoryId
    const response = await axios.patch(USERSTORY_UPDATE_API_URL, parameters, {
      headers: { Authorization: `Bearer ${token}` }
    })
    // console.log(response);
    if (response.data.id) {
      return {
        success: true,
        message: `User Story with id ${userstoryId} successfully updated`,
        userstoryId: response.data.id
      }
    } else {
      return {
        success: false,
        message: 'Something went wrong while updating userstory'
      }
    }
  } catch (error) {
    console.error(error)
    return { success: false, message: 'Error updating userstory' }
  }
}

// Function to get the user name from user id
async function getUserName (token, assignedTo) {
  const GET_USER_NAME_URL = GET_USER_URL + '/' + assignedTo
  try {
    const response = await axios.get(GET_USER_NAME_URL, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data.full_name
  } catch (error) {
    return error
  }
}

// Function to get the user story detail
async function getUserStory (token, projectId) {
  const GET_USER_STORY_URL = USERSTORY_API_URL + '?project=' + projectId
  try {
    const response = await axios.get(GET_USER_STORY_URL, {
      headers: { Authorization: `Bearer ${token}` }
    })
    const GET_POINTS_URL = POINTS_URL + '?project=' + projectId
    const pointsResponse = await axios.get(GET_POINTS_URL, {
      headers: { Authorization: `Bearer ${token}` }
    })

    const points = pointsResponse.data

    const newResponse = []
    for (let i = 0; i < response.data.length; i++) {
      const pointsMapping = response.data[i].points
      let totalPoints = 0
      for (const pointId in pointsMapping) {
        const pointsId = pointsMapping[pointId]
        const point = points.find((p) => p.id === pointsId)
        if (point) {
          totalPoints += point.value
        }
      }
      const { id, subject } = response.data[i]
      const status = response.data[i].status_extra_info.name
      let assignee = 'none'
      const assignedTo = response.data[i].assigned_to

      if (assignedTo) {
        assignee = await getUserName(token, assignedTo)
      }

      newResponse.push({ id, subject, status, assignee, totalPoints })
    }
    if (newResponse.length) {
      return {
        success: true,
        userStory: newResponse
      }
    } else {
      return {
        success: true,
        message: 'No User story found for this project.',
        userStory: newResponse
      }
    }
  } catch (error) {
    return { success: false, message: 'Error getting user story names' }
  }
}

async function getUserStoryDetails (token, slugName, userstoryName) {
  try {
    const USERSTORY_DETAILS_API_URL =
      USERSTORY_API_URL + '?project__slug=' + slugName
    const response = await axios.get(USERSTORY_DETAILS_API_URL, {
      headers: { Authorization: `Bearer ${token}` }
    })
    const parameters = {}
    for (let i = 0; i < response.data.length; i++) {
      if (response.data[i].subject === userstoryName) {
        parameters.id = response.data[i].id
        parameters.version = response.data[i].version
        parameters.ref = response.data[i].ref
        parameters.projectId = response.data[i].project
      }
    }
    if (parameters.id) {
      return {
        success: true,
        message: 'successfully fetched details',
        parameters
      }
    } else {
      return {
        success: false,
        message: 'User Story not found'
      }
    }
  } catch (error) {
    return { success: false, message: 'Error fetching userstories details' }
  }
}

async function getPointValues (token, projectId) {
  try {
    const PROJECT_POINTS_DETAILS_URL = POINTS_API_URL + '?project=' + projectId
    const response = await axios.get(PROJECT_POINTS_DETAILS_URL, {
      headers: { Authorization: `Bearer ${token}` }
    })
    const pointValues = {}
    response.data.forEach(element => {
      pointValues[element.name] = element.id
    })
    return { success: true, message: 'successfully fetched points list', pointValues }
  } catch (error) {
    return { success: false, message: 'Not able to fetch points' }
  }
}

async function getRoleId (authToken, projectId) {
  try {
    const TYPE_API_URL = `https://api.taiga.io/api/v1/roles?project=${projectId}`
    const response = await axios.get(TYPE_API_URL,
      { headers: { Authorization: `Bearer ${authToken}` } }
    )
    const roleIds = {}
    response.data.forEach(element => {
      roleIds[element.name] = element.id
    })
    return { success: true, message: 'successfully fetched role list', roleIds }
  } catch (error) {
    return { success: false, message: 'Error getting role list' }
  }
}

async function deleteUserStory (token, userstoryId) {
  try {
    const DELETE_USERSTORY_URL = USERSTORY_API_URL + '/' + userstoryId
    await axios.delete(DELETE_USERSTORY_URL, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return { success: true, message: 'userstory successfully deleted' }
  } catch (error) {
    return { success: false, message: 'Not able to fetch points' }
  }
}

module.exports = {
  createUserstory,
  updateUserstory,
  getToken,
  getUserStoryDetails,
  getProjectBySlug,
  getUserStory,
  getPointValues,
  getRoleId,
  deleteUserStory,
  moveUserStory
}
