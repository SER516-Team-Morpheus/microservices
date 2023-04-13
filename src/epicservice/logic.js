const axios = require('axios')
require('dotenv').config({ path: '../.env' })

const EPIC_API_URL = `${process.env.TAIGA_API_BASE_URL}/epics`
const AUTH_URL = `${process.env.TAIGA_API_BASE_URL}/auth`
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

// Function to create new epic
async function createEpic (
  name,
  project,
  description,
  token
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
    // console.log(response.data)
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
    console.error(error.response.data)
    return { success: false, message: 'Error creating epic' }
  }
}

// Function to list epics
// await listEpics(authToken, projectId, projectSlug, assignedTo, isClosed)
async function listEpics (
  token,
  projectId,
  projectSlug,
  assignedTo,
  isClosed
) {
  try {
    const response = await axios.get(EPIC_API_URL, {
      params: Object.assign({},
        projectId && { project: projectId },
        projectSlug && { project__slug: projectSlug },
        assignedTo && { assigned_to: assignedTo },
        isClosed && { is_closed: isClosed }
      ),
      headers: { Authorization: `Bearer ${token}` }
    })
    if (response.data) {
      return {
        success: true,
        epics: response.data
      }
    } else {
      return {
        success: false,
        message: 'Something went wrong while listing epics'
      }
    }
  } catch (error) {
    console.error(error.response.data)
    return { success: false, message: 'Error listing epics' }
  }
}

// Function to get epic details
async function getEpic (token, epicId) {
  try {
    const response = await axios.get(`${EPIC_API_URL}/${epicId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (response.data) {
      return {
        success: true,
        epic: response.data
      }
    } else {
      return {
        success: false,
        message: 'Something went wrong while getting epic details'
      }
    }
  } catch (error) {
    console.error(error.response.data)
    return { success: false, message: 'Error getting epic details' }
  }
}

// Function to Edit epic details
async function editEpic (epicId, name, version = 1, token) {
  try {
    const response = await axios.patch(
      `${EPIC_API_URL}/${epicId}`,
      {
        subject: name,
        version
      },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    if (response.data) {
      return {
        success: true,
        epic: response.data
      }
    } else {
      return {
        success: false,
        message: 'Something went wrong while editing epic details'
      }
    }
  } catch (error) {
    console.error(error.response.data)
    return { success: false, message: 'Error editing epic details' }
  }
}

// Function to delete epic
async function deleteEpic (epicId, token) {
  try {
    const response = await axios.delete(`${EPIC_API_URL}/${epicId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (response.data) {
      return {
        success: true,
        epic: response.data
      }
    } else {
      return {
        success: false,
        message: 'Something went wrong while deleting epic'
      }
    }
  } catch (error) {
    console.error(error.response.data)
    return { success: false, message: 'Error deleting epic' }
  }
}

// Function to create bulk epics
async function createBulkEpics (projectId, epics, token) {
  try {
    const response = await axios.post(
      EPIC_API_URL,
      {
        project_id: projectId,
        bulk_epics: epics
      },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    if (response.data) {
      return {
        success: true,
        epics: response.data
      }
    } else {
      return {
        success: false,
        message: 'Something went wrong while creating bulk epics'
      }
    }
  } catch (error) {
    console.error(error.response.data)
    return { success: false, message: 'Error creating bulk epics' }
  }
}

// Function to get filters data
async function getFiltersData (token, projectId) {
  try {
    const response = await axios.get(`${EPIC_API_URL}/filters_data`, {
      params: {
        project: projectId
      },
      headers: { Authorization: `Bearer ${token}` }
    })
    if (response.data) {
      return {
        success: true,
        filtersData: response.data
      }
    } else {
      return {
        success: false,
        message: 'Something went wrong while getting filters data'
      }
    }
  } catch (error) {
    console.error(error.response.data)
    return { success: false, message: 'Error getting filters data' }
  }
}

// Function for listing related user stories
async function listRelatedUserStories (token, epicId) {
  try {
    const response = await axios.get(
      `${EPIC_API_URL}/${epicId}/related_userstories`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    )
    if (response.data) {
      return {
        success: true,
        userStories: response.data
      }
    } else {
      return {
        success: false,
        message: 'Something went wrong while listing related user stories'
      }
    }
  } catch (error) {
    console.error(error.response.data)
    return { success: false, message: 'Error listing related user stories' }
  }
}

// Function for adding related user story
async function addRelatedUserStory (token, epicId, userStoryId) {
  try {
    const response = await axios.post(
      `${EPIC_API_URL}/${epicId}/related_userstories`,
      {
        epic: epicId,
        user_story: userStoryId
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    )
    if (response.data) {
      return {
        success: true,
        userStory: response.data
      }
    } else {
      return {
        success: false,
        message: 'Something went wrong while adding related user story'
      }
    }
  } catch (error) {
    console.error(error.response.data)
    return { success: false, message: 'Error adding related user story' }
  }
}

// Function for getting related user story
async function getRelatedUserStory (token, epicId, userStoryId) {
  try {
    const response = await axios.get(
      `${EPIC_API_URL}/${epicId}/related_userstories/${userStoryId}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    )
    if (response.data) {
      return {
        success: true,
        userStory: response.data
      }
    } else {
      return {
        success: false,
        message: 'Something went wrong while getting related user story'
      }
    }
  } catch (error) {
    console.error(error.response.data)
    return { success: false, message: 'Error getting related user story' }
  }
}

// Function for editing related user story
async function editRelatedUserStory (token, epicId, userStoryId, order) {
  try {
    const response = await axios.patch(
      `${EPIC_API_URL}/${epicId}/related_userstories/${userStoryId}`,
      {
        order
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    )
    if (response.data) {
      return {
        success: true,
        userStory: response.data
      }
    } else {
      return {
        success: false,
        message: 'Something went wrong while editing related user story'
      }
    }
  } catch (error) {
    console.error(error.response.data)
    return { success: false, message: 'Error editing related user story' }
  }
}

// Function for deleting related user story
async function deleteRelatedUserStory (token, epicId, userStoryId) {
  try {
    const response = await axios.delete(
      `${EPIC_API_URL}/${epicId}/related_userstories/${userStoryId}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    )
    if (response.data) {
      return {
        success: true,
        userStory: response.data
      }
    } else {
      return {
        success: false,
        message: 'Something went wrong while deleting related user story'
      }
    }
  } catch (error) {
    console.error(error.response.data)
    return { success: false, message: 'Error deleting related user story' }
  }
}

// Function for bulk creating related user stories
async function bulkCreateRelatedUserStories (token, projectId, userStories) {
  try {
    const response = await axios.post(
      `${EPIC_API_URL}/${epicId}/bulk_create_related_userstories`,
      {
        project_id: projectId,
        bulk_userstories: userStories
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    )
    if (response.data) {
      return {
        success: true,
        userStories: response.data
      }
    } else {
      return {
        success: false,
        message: 'Something went wrong while bulk creating related user stories'
      }
    }
  } catch (error) {
    console.error(error.response.data)
    return { success: false, message: 'Error bulk creating related user stories' }
  }
}

module.exports = {
  createEpic,
  getToken,
  listEpics,
  getEpic,
  editEpic,
  deleteEpic,
  createBulkEpics,
  getFiltersData,
  listRelatedUserStories,
  addRelatedUserStory,
  getRelatedUserStory,
  editRelatedUserStory,
  deleteRelatedUserStory,
  bulkCreateRelatedUserStories
}
