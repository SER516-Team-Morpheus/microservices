const axios = require('axios')
const AWS = require('aws-sdk')

// Define variables/constants
const STATUS_MATRIX = { date: new Date().toISOString().slice(0, 10) + ';' }
const TAIGA_BASE = 'https://api.taiga.io/api/v1'

// Define helper functions
function getHeaders (token) {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  }
}

async function getToken () {
  const body = {
    username: 'sertestuser',
    password: 'testuser',
    type: 'normal'
  }

  const url = `${TAIGA_BASE}/auth`
  const res = await axios.post(url, body, { headers: { 'Content-Type': 'application/json' } })
  const data = res.data
  return data.auth_token
}

async function getMember (headers) {
  const url = `${TAIGA_BASE}/users/me`
  const res = await axios.get(url, { headers })
  const data = res.data
  return data.id
}

async function getProjectList (headers, memberId) {
  const url = `${TAIGA_BASE}/projects?member=${memberId}`
  const res = await axios.get(url, { headers })
  return res.data
}

async function getTasks (headers, projectSlug) {
  const url = `${TAIGA_BASE}/tasks?project__slug=${projectSlug}`
  const res = await axios.get(url, { headers })
  return res.data
}

// Define main function
async function makeStatusMatrix () {
  // Initialize headers and member ID
  const headers = getHeaders(await getToken())
  const memberId = await getMember(headers)

  // Retrieve list of projects
  const projects = await getProjectList(headers, memberId)

  // Iterate through each project and retrieve its task statuses and tasks
  for (const project of projects) {
    const statusUrl = `${TAIGA_BASE}/task-statuses?project=${project.id}`
    const statuses = await axios.get(statusUrl, { headers }).then((res) => res.data)

    // Create an empty status matrix for the current project
    const emptyMatrix = {}
    for (const status of statuses) {
      emptyMatrix[status.name] = 0
    }

    // Add the empty status matrix to the overall STATUS_MATRIX object
    STATUS_MATRIX[project.slug] = emptyMatrix

    // Retrieve the tasks for the current project and update the status matrix accordingly
    const tasks = await getTasks(headers, project.slug)
    for (const task of tasks) {
      STATUS_MATRIX[project.slug][task.status_extra_info.name] += 1
    }
  }

  return STATUS_MATRIX
}

async function uploadStatusMatrixToDynamoDB () {
  try {
    const MATRIX = await makeStatusMatrix()
    const date = MATRIX.date
    delete MATRIX.date
    const UPLOAD_LIST = []

    for (const [name, statusMatrix] of Object.entries(MATRIX)) {
      const uploadMatrix = {
        recordKey: date + name
      }

      for (const [status, count] of Object.entries(statusMatrix)) {
        uploadMatrix[status] = count
      }

      UPLOAD_LIST.push(uploadMatrix)
    }
    const dynamodb = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' })
    const tableName = 'ser516-cfd-data'

    for (const item of UPLOAD_LIST) {
      const params = {
        TableName: tableName,
        Item: item
      }

      await dynamodb.put(params).promise()
    }
  } catch (err) {
    console.error(err)
  }
}

uploadStatusMatrixToDynamoDB()
