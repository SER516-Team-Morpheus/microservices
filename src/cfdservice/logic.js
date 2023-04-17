const axios = require('axios')

const TAIGA_BASE = 'https://api.taiga.io/api/v1'

function getHeaders (token) {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  }
}

function getTaskStatus (historyObject, date, createdDate) {
  historyObject.sort((a, b) => {
    return Date.parse(b.created_at) - Date.parse(a.created_at)
  })
  let status = ''
  historyObject.forEach(obj => {
    if (new Date(obj.created_at) <= date) {
      status = obj.values_diff.status[obj.values_diff.status.length - 1]
    }
  })
  if (status) {
    return status
  } else {
    if (createdDate < date) {
      return 'New'
    } else {
      return ''
    }
  }
}

async function getToken (username, password) {
  const body = {
    username,
    password,
    type: 'normal'
  }

  const url = `${TAIGA_BASE}/auth`
  try {
    const res = await axios.post(url, body, { headers: { 'Content-Type': 'application/json' } })
    const data = res.data
    return { token: data.auth_token, success: true }
  } catch (err) {
    return { error: err, success: false }
  }
}

async function getProjectID (headers, slug) {
  const PROJECT_SLUG_URL = TAIGA_BASE + '/projects/by_slug?slug=' + slug
  try {
    const response = await axios.get(PROJECT_SLUG_URL, {
      headers
    })
    if (response.data.id) {
      return {
        success: true,
        projectId: response.data.id
      }
    } else {
      return {
        success: false,
        message: 'Project Not Found'
      }
    }
  } catch (error) {
    return { success: false, message: 'Error getting project by name' }
  }
}

async function getTasks (headers, projectSlug) {
  const url = `${TAIGA_BASE}/tasks?project__slug=${projectSlug}`
  const res = await axios.get(url, { headers })
  return res.data
}
async function getTasksHistory (headers, ID) {
  const url = `${TAIGA_BASE}/history/task/${ID}`
  const res = await axios.get(url, { headers })
  return res.data
}

async function getTaskStatuses (headers, projectID) {
  try {
    const statusUrl = `${TAIGA_BASE}/task-statuses?project=${projectID}`
    const statuses = await axios.get(statusUrl, { headers }).then((res) => res.data)
    const emptyMatrix = {}
    for (const status of statuses) {
      emptyMatrix[status.name] = 0
    }
    return emptyMatrix
  } catch (error) {
    return { success: false, message: 'Error getting project by name' }
  }
}

module.exports = { getHeaders, getToken, getProjectID, getTaskStatuses, getTasks, getTasksHistory, getTaskStatus }
