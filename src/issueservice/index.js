/* eslint-disable camelcase */
const express = require('express')
const {
  createIssue, getIssues, getIssue, deleteIssue, getToken, getIssueDetails, updateIssue, getIssuePrioritiesList,
  getIssueSeveritiesList, getIssueTypeList, getIssueStatusList
} = require('./logic')

const app = express()
const port = 3009

app.use(express.json())

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  next()
})

// Endpoint for creating a new issue
app.post('/createIssue', async (req, res) => {
  const {
    username, password, assigned_to, blocked_note = null, description, project
    , severity, status, subject, is_blocked = false, priority, type, is_closed = false
  } = req.body
  const issueData = await createIssue(username, password, assigned_to, blocked_note, description, project
    , severity, status, subject, is_blocked, priority, type, is_closed)
  if (!issueData.success) {
    return res.status(500).send({
      success: false,
      message: 'Error creating issue'
    })
  }

  return res.status(201).send(issueData)
})

// Endpoint for getting  all issues details
app.get('/getIssues', async (req, res) => {
  const { username, password, projectId } = req.query
  const issueData = await getIssues(username, password, projectId)
  if (issueData.success) {
    const result = issueData.data.map(issue => ({
      id: issue.id,
      subject: issue.subject,
      project: issue.project,
      assigned_to: issue.assigned_to,
      is_blocked: issue.is_blocked,
      is_closed: issue.is_closed,
      status_id: issue.status,
      status: issue.status_extra_info.name
    }))
    return res.status(201).send({ success: true, data: result })
  }
  return res.status(500).send(issueData)
})

// Endpoint for getting  all issues details
app.get('/getIssueById', async (req, res) => {
  const { username, password, issueId } = req.query
  const issueData = await getIssue(username, password, issueId)
  const result = {
    id: issueData.data.id,
    project: issueData.data.project,
    status_id: issueData.data.status,
    status: issueData.data.status_extra_info.name,
    assigned_to: issueData.data.assigned_to == null ? null : issueData.data.assigned_to_extra_info.full_name_display,
    subject: issueData.data.subject,
    description: issueData.data.description,
    is_blocked: issueData.data.is_blocked,
    is_closed: issueData.data.is_closed,
    severity: issueData.data.severity,
    priority: issueData.data.priority,
    type: issueData.data.type
  }
  if (issueData.success) {
    return res.status(201).send({ success: true, data: result })
  }
  return res.status(500).send(issueData)
})

// Endpoint for deleting an issue
app.delete('/deleteIssue/:id', async (req, res) => {
  const { username, password } = req.body
  const issueId = req.params.id
  const issueData = await deleteIssue(username, password, issueId)
  if (!issueData.success) {
    return res.status(500).send({
      success: false,
      message: 'Error deleting issue'
    })
  }

  return res.status(201).send({ success: true, message: 'Issue successfully deleted' })
})

app.patch('/updateIssue', async (req, res) => {
  const { username, password, projectname, issuename } = req.body
  const slugName = `${username.toLowerCase()}-${projectname.toLowerCase()}`
  const authToken = await getToken(username, password)
  const issueDetails = await getIssueDetails(authToken, slugName, issuename)
  if (!issueDetails.success) {
    return res.status(500).send({
      issueDetails
    })
  } else {
    const version = issueDetails.parameters.version
    const issueId = issueDetails.parameters.issueId
    const projectId = issueDetails.parameters.projectId
    const parameters = {}
    if (req.body.status !== undefined) {
      const statuses = await getIssueStatusList(authToken, projectId)
      if (statuses.success) {
        parameters.status = statuses.statusTypes[req.body.status.toLowerCase()]
      }
    }
    if (req.body.priority !== undefined) {
      const priorities = await getIssuePrioritiesList(authToken, projectId)
      if (priorities.success) {
        parameters.priority = priorities.prioritiesTypes[req.body.priority.toLowerCase()]
      }
    }

    if (req.body.severity !== undefined) {
      const severities = await getIssueSeveritiesList(authToken, projectId)
      if (severities.success) {
        parameters.severity = severities.severitiesTypes[req.body.severity.toLowerCase()]
      }
    }

    if (req.body.type !== undefined) {
      const issues = await getIssueTypeList(authToken, projectId)
      if (issues.success) {
        parameters.type = issues.issueTypes[req.body.type.toLowerCase()]
      }
    }

    parameters.version = version
    const issueData = await updateIssue(authToken, issueId, parameters)
    if (!issueData.success) {
      return res.status(500).send({
        success: false,
        message: 'Error updating issue'
      })
    }

    return res.status(201).send(issueData)
  }
})

// Start the server
app.listen(port, () => {
  console.log(
        `Issue microservice running at http://localhost:${port}`
  )
})

module.exports = app
