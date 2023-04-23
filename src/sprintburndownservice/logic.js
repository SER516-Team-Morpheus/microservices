const axios = require('axios')

const TAIGA_BASE = 'https://api.taiga.io/api/v1'
const SPRINT_URL = 'https://api.taiga.io/api/v1/milestones/'

function getHeaders (token) {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
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

async function getSprintStates (headers, sprintID) {
  const GET_STATES = SPRINT_URL + sprintID + '/stats'
  try {
    const response = await axios.get(GET_STATES, { headers })
    if (response.status === 200) {
      return {
        success: true,
        data: response.data
      }
    } else {
      return {
        success: false,
        message: 'Error In Retriving STATS. Did you enter correct sprintID'
      }
    }
  } catch (error) {
    console.log(error)
    return { success: false, message: 'Error getting Sprint Stats details.' }
  }
}

module.exports = {
  getHeaders,
  getToken,
  getSprintStates
}
