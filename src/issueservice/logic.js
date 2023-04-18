/* eslint-disable camelcase */
const axios = require('axios')
require('dotenv').config({ path: '../.env' })

const AUTH_API_URL = 'https://api.taiga.io/api/v1/auth'
const ISSUE_API_URL = 'https://api.taiga.io/api/v1/issues'

async function getItemId (apiEndpoint, projectId, itemName, authToken) {
  const response = await axios.get(`https://api.taiga.io${apiEndpoint}?project=${projectId}`,
    {
      headers: { Authorization: `Bearer ${authToken}` }
    })
  const items = response.data
  const item = items.find(i => i.name === itemName)
  return item ? item.id : null
}

async function getItemName (apiEndpoint, projectId, itemId, authToken) {
  const response = await axios.get(`https://api.taiga.io${apiEndpoint}?project=${projectId}`,
    {
      headers: { Authorization: `Bearer ${authToken}` }
    })
  const items = response.data
  const item = items.find(i => i.id === itemId)
  return item ? item.name : null
}

async function createIssue (username, password, assigned_to, blocked_note, description, project
  , severity, status, subject, is_blocked, priority, type, is_closed) {
  try {
    const response1 = await axios.post(AUTH_API_URL, {
      type: 'normal',
      username,
      password
    })
    const authToken = response1.data.auth_token
    const typeApiEndpoint = '/api/v1/issue-types'
    const typeId = await getItemId(typeApiEndpoint, project, type, authToken)
    const severityApiEndpoint = '/api/v1/severities'
    const severityId = await getItemId(severityApiEndpoint, project, severity, authToken)
    const priorityApiEndpoint = '/api/v1/priorities'
    const priorityId = await getItemId(priorityApiEndpoint, project, priority, authToken)
    const statusApiEndpoint = '/api/v1/issue-statuses'
    const statusId = await getItemId(statusApiEndpoint, project, status, authToken)
    const response = await axios.post(
      ISSUE_API_URL,
      {
        assigned_to,
        blocked_note,
        description,
        project,
        severity: severityId,
        status: statusId,
        subject,
        is_blocked,
        priority: priorityId,
        type: typeId,
        is_closed
      },
      { headers: { Authorization: `Bearer ${authToken}` } }
    )
    if (response.data.id) {
      return { success: true, issueId: response.data.id }
    } else {
      return {
        success: false,
        message: 'Something went wrong while creating an issue'
      }
    }
  } catch (error) {
    return { success: false, message: 'Error creating issue' }
  }
}

async function getIssues (username, password, projectId) {
  try {
    const response1 = await axios.post(AUTH_API_URL, {
      type: 'normal',
      username,
      password
    })
    const token = response1.data.auth_token
    const ISSUES_API_URL = `${ISSUE_API_URL}?project=${projectId}`
    const response = await axios.get(ISSUES_API_URL, {
      headers: { Authorization: `Bearer ${token}` }
    })

    return { success: true, data: response.data }
  } catch (error) {
    return { success: false, message: 'Error getting issues' }
  }
}

async function getIssue (username, password, issueId) {
  try {
    const response1 = await axios.post(AUTH_API_URL, {
      type: 'normal',
      username,
      password
    })
    const token = response1.data.auth_token
    const ISSUES_API_URL = `${ISSUE_API_URL}/${issueId}`
    const response = await axios.get(ISSUES_API_URL, {
      headers: { Authorization: `Bearer ${token}` }
    })
    const severityApiEndpoint = '/api/v1/severities'
    const severity = response.data.severity
    response.data.severity = await getItemName(severityApiEndpoint, response.data.project, severity, token)
    const priorityApiEndpoint = '/api/v1/priorities'
    const priority = response.data.priority
    response.data.priority = await getItemName(priorityApiEndpoint, response.data.project, priority, token)
    const typeApiEndpoint = '/api/v1/issue-types'
    const type = response.data.type
    response.data.type = await getItemName(typeApiEndpoint, response.data.project, type, token)
    return { success: true, data: response.data }
  } catch (error) {
    return { success: false, message: 'Error getting issue' }
  }
}

// Function to delete an issue
async function deleteIssue (username, password, issueId) {
  try {
    const response1 = await axios.post(AUTH_API_URL, {
      type: 'normal',
      username,
      password
    })
    const token = response1.data.auth_token
    const ISSUES_API_URL = `${ISSUE_API_URL}/${issueId}`
    const response = await axios.delete(
      ISSUES_API_URL,
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

async function getToken (username, password) {
  try {
    const response = await axios.post(AUTH_API_URL, {
      type: 'normal',
      username,
      password
    })
    if (response.data.auth_token) {
      return response.data.auth_token
    }
    return { auth_token: 'NULL' }
  } catch (error) {
    return { auth_token: 'NULL' }
  }
}

async function getIssueDetails (authToken, slugName, issueName) {
  try {
    const ISSUEDETAILS_URL = `${ISSUE_API_URL}?project__slug=${slugName}`
    const response = await axios.get(
      ISSUEDETAILS_URL,
      { headers: { Authorization: `Bearer ${authToken}` } }
    )
    const parameters = {}
    for (let i = 0; i < response.data.length; i += 1) {
      if (response.data[i].subject === issueName) {
        parameters.subject = response.data[i].subject
        parameters.issueId = response.data[i].id
        parameters.version = response.data[i].version
        parameters.projectId = response.data[i].project
      }
    }
    if (parameters.issueId) {
      return {
        success: true,
        message: 'successfully fetched details',
        parameters
      }
    }

    return {
      success: false,
      message: 'Issue not found'
    }
  } catch (error) {
    return { success: false, message: 'Error fetching issue details' }
  }
}
async function updateIssue (authToken, issueId, parameters) {
  try {
    const ISSUE_UPDATE_API_URL = `${ISSUE_API_URL}/${issueId}`
    const response = await axios.patch(
      ISSUE_UPDATE_API_URL,
      parameters,
      { headers: { Authorization: `Bearer ${authToken}` } }
    )
    return { success: true, message: 'Issue Updated successfully', issueID: response.data.id }
  } catch (error) {
    return { success: false, message: 'Error updating issues' }
  }
}

async function getIssuePrioritiesList (authToken, projectId) {
  try {
    const PRIORITY_API_URL = `https://api.taiga.io/api/v1/priorities?project=${projectId}`
    const response = await axios.get(PRIORITY_API_URL,
      { headers: { Authorization: `Bearer ${authToken}` } }
    )
    const prioritiesTypes = {}
    response.data.forEach(element => {
      prioritiesTypes[element.name.toLowerCase()] = element.id
    })
    return { success: true, message: 'successfully fetched priorities list', prioritiesTypes }
  } catch (error) {
    return { success: false, message: 'Error getting priorities list' }
  }
}

async function getIssueSeveritiesList (authToken, projectId) {
  try {
    const SEVERITY_API_URL = `https://api.taiga.io/api/v1/severities?project=${projectId}`
    const response = await axios.get(SEVERITY_API_URL,
      { headers: { Authorization: `Bearer ${authToken}` } }
    )
    const severitiesTypes = {}
    response.data.forEach(element => {
      severitiesTypes[element.name.toLowerCase()] = element.id
    })
    return { success: true, message: 'successfully fetched severities list', severitiesTypes }
  } catch (error) {
    return { success: false, message: 'Error getting severities list' }
  }
}

async function getIssueTypeList (authToken, projectId) {
  try {
    const TYPE_API_URL = `https://api.taiga.io/api/v1/issue-types?project=${projectId}`
    const response = await axios.get(TYPE_API_URL,
      { headers: { Authorization: `Bearer ${authToken}` } }
    )
    const issueTypes = {}
    response.data.forEach(element => {
      issueTypes[element.name.toLowerCase()] = element.id
    })
    return { success: true, message: 'successfully fetched issueTypes list', issueTypes }
  } catch (error) {
    return { success: false, message: 'Error getting issueTypes list' }
  }
}

async function getIssueStatusList (authToken, projectId) {
  try {
    const STATUS_API_URL = `https://api.taiga.io/api/v1/issue-statuses?project=${projectId}`
    const response = await axios.get(STATUS_API_URL,
      { headers: { Authorization: `Bearer ${authToken}` } }
    )
    const statusTypes = {}
    response.data.forEach(element => {
      statusTypes[element.name.toLowerCase()] = element.id
    })
    return { success: true, message: 'successfully fetched statusTypes list', statusTypes }
  } catch (error) {
    return { success: false, message: 'Error getting statusTypes list' }
  }
}

module.exports = {
  createIssue,
  getIssues,
  getIssue,
  deleteIssue,
  updateIssue,
  getToken,
  getIssueDetails,
  getIssuePrioritiesList,
  getIssueSeveritiesList,
  getIssueTypeList,
  getIssueStatusList
}
