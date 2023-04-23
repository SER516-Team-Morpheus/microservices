const axios = require('axios')

const TAIGA_BASE = 'https://api.taiga.io/api/v1'
const PROJECT_URL = 'https://api.taiga.io/api/v1/projects/'

function getHeaders (token) {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  }
}

function getTaskStatus (historyObject, date, createdDate, task) {
  historyObject = historyObject.filter((obj) => {
    const createdAt = new Date(obj.created_at)
    return createdAt.getTime() <= date.getTime()
  })
  let status = ''
  if (historyObject.length) {
    historyObject.sort((a, b) => {
      return Date.parse(b.created_at) - Date.parse(a.created_at)
    })
    status = historyObject[0].values_diff.status[
      historyObject[0].values_diff.status.length - 1
    ]
  }
  if (status) {
    return status
  } else {
    if (createdDate < date) {
      return task.status_extra_info.name
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
    return { error: err.response.data._error_message, success: false }
  }
}

async function getProjectByID (headers, projectId) {
  const GET_MEMBER_PROJECT = PROJECT_URL + projectId
  try {
    const response = await axios.get(GET_MEMBER_PROJECT, { headers })
    if (response.status === 200) {
      return {
        success: true,
        project: response.data
      }
    } else {
      return {
        success: false,
        message: 'Error In Retriving project. Did you enter correct projectID'
      }
    }
  } catch (error) {
    console.log(error)
    return { success: false, message: 'Error getting project details.' }
  }
}

async function getTasks (headers, projectSlug) {
  try {
    const url = `${TAIGA_BASE}/tasks?project__slug=${projectSlug}&page_size=100000`
    const res = await axios.get(url, { headers })
    return { data: res.data, success: true }
  } catch (error) {
    return { error, success: false }
  }
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

module.exports = {
  getHeaders,
  getToken,
  getTaskStatuses,
  getTasks,
  getTasksHistory,
  getTaskStatus,
  getProjectByID
}
