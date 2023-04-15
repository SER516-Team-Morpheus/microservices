const express = require('express')
const { createIssue, getIssues, getIssue, deleteIssue } = require('./logic')

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
    const { username, password, assigned_to, blocked_note = null, description, project
    , severity, status, subject, is_blocked = false, priority, type, is_closed = false } = req.body
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
        subject:issue.subject,
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
      return res.status(201).send({ success: true, data: result  })
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

// Start the server
app.listen(port, () => {
    console.log(
        `Issue microservice running at http://localhost:${port}`
    )
  })
  
module.exports = app
