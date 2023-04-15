const AWS = require('aws-sdk')
const axios = require('axios')
require('dotenv').config({ path: '../.env' })

// Initialization DynamoDB client
const dynamodb = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' })

const TAIGA_BASE = 'https://api.taiga.io/api/v1'

function getHeaders(token) {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  }
}

async function getToken() {
  const body = {
    username: 'sertestuser',
    password: 'testuser',
    type: 'normal'
  }

  const url = `${TAIGA_BASE}/auth`
  try {
    const res = await axios.post(url, body, { headers: { 'Content-Type': 'application/json' } })
    const data = res.data
    return { token: data.auth_token, success: true }
  } catch(err) {
    return { error: err, success: false }
  }
  
}

async function getProjectID(headers, slug) {
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

async function getTaskStatuses(headers, projectID) {
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

// Function to fetch data from DynamoDB
async function fetchData(params) {
  try {
    const data = dynamodb.query(params, (err, data) => {
      if (err) {
        return { success: false }
      } else {
        return { data: data.Items, success: true }
      }
    })
    return { success: false }
  } catch (error) {
    console.log(`Error fetching data from DynamoDB: ${error}`);
    return { success: false }
  }
}

module.exports = { fetchData, getHeaders, getToken, getProjectID, getTaskStatuses };