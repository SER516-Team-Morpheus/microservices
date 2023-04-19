const axios = require('axios')

const TAIGA_BASE = 'https://api.taiga.io/api/v1'
const MEMBER_URL = `${TAIGA_BASE}/users/me`

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

async function getMember (headers) {
  try {
    const response = await axios.get(MEMBER_URL,
      { headers }
    )
    if (response.data.id) {
      return {
        success: true,
        memberId: response.data.id
      }
    } else {
      return {
        success: false,
        message: 'No member found.'
      }
    }
  } catch (error) {
    return { success: false, message: error.response.data }
  }
}

async function getProjectByName (headers, memberId, name) {
  const GET_MEMBER_PROJECT = TAIGA_BASE + '/projects' + '?member=' + memberId
  try {
    const response = await axios.get(GET_MEMBER_PROJECT, { headers })

    const newResponse = []
    for (let i = 0; i < response.data.length; i++) {
      if (response.data[i].name === name) {
        const { name, description, id, slug } = response.data[i]
        newResponse.push({ name, description, id, slug })
      }
    }

    if (newResponse.length) {
      return {
        success: true,
        projects: newResponse
      }
    } else {
      return {
        success: false,
        message: 'Authentication issue.'
      }
    }
  } catch (error) {
    console.log(error)
    return { success: false, message: 'Error getting project details.' }
  }
}

async function getProject (headers, name) {
  const memberData = await getMember(headers)
  if (!memberData.success) {
    return { success: false, error: 'Memmer ID could not retrived' }
  }
  const memberId = memberData.memberId
  const project = await getProjectByName(headers, memberId, name)
  if (project.success) {
    return { project: project.projects[0], success: true }
  } else {
    return { success: false }
  }
}

async function getTasks (headers, projectSlug) {
  const url = `${TAIGA_BASE}/tasks?project__slug=${projectSlug}&page_size=100000`
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

module.exports = { getHeaders, getToken, getProject, getTaskStatuses, getTasks, getTasksHistory, getTaskStatus }
