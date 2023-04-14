const express = require('express')
const { createIssue, getIssues } = require('./logic')

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
        , severity, status, subject, is_blocked, priority, type)
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
        created_date: issue.created_date,
        is_blocked: issue.is_blocked,
        is_closed: issue.is_closed,
        status_id: issue.status,
        status: issue.status_extra_info.name,
        priority: issue.priority,
        severity: issue.severity
      }))
      return res.status(201).send({ success: true, data: result })
    }
    return res.status(500).send(issuerData)
  })

// Start the server
app.listen(port, () => {
    console.log(
        `Issue microservice running at http://localhost:${port}`
    )
  })
  
module.exports = app
