const express = require('express')
const app = express()
const { getProjectID, getAllSprints, getSprintByName, createSprint, deleteSprint, editSprint, getToken } = require('./logic')

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
  next()
})

app.use(express.json())
app.use(
  express.urlencoded({
    extended: true
  })
)

app.get('/sprints', async (req, res) => {
  let token = req.body.token
  const { username, password } = req.body
  if (!token) {
    token = await getToken(username, password)
  }
  const projectName = req.body.projectName
  if (!projectName) {
    return res.status(500).json({ error: 'Project Name is not sent in request body.', success: false })
  }
  const projectID = await getProjectID(username, password, projectName)
  if (!projectID) {
    return res.status(500).json({ error: 'Project not found.', success: false })
  }
  try {
    const sprints = await getAllSprints(token, projectID)
    res.status(200).send({ sprints, success: true })
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving sprints.', success: false })
  }
})

app.get('/sprintByName', async (req, res) => {
  let token = req.body.token
  const { username, password } = req.body
  if (!token) {
    token = await getToken(username, password)
  }
  const { sprintName, projectName } = req.body
  if (!sprintName) {
    return res.status(500).json({ error: 'Sprint Name is not sent in request body.', success: false })
  }
  if (!projectName) {
    return res.status(500).json({ error: 'Project Name is not sent in request body.', success: false })
  }
  const projectID = await getProjectID(username, password, projectName)
  if (!projectID) {
    return res.status(500).json({ error: 'Project not found.', success: false })
  }

  try {
    // eslint-disable-next-line no-undef
    sprint = await getSprintByName(sprintName, token, projectID)
    // eslint-disable-next-line no-undef
    if (sprint.success) {
      // eslint-disable-next-line no-undef
      res.status(200).send(sprint)
    } else {
      // eslint-disable-next-line no-undef
      res.status(500).send(sprint)
    }
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving sprint', success: false })
  }
})

app.patch('/editSprintByName', async (req, res) => {
  let token = req.body.token
  const { username, password } = req.body
  if (!token) {
    token = await getToken(username, password)
  }
  const patch = req.body.patch
  const projectName = req.body.projectName
  if (!projectName) {
    return res.status(500).json({ error: 'Project Name is not sent in request body.', success: false })
  }
  const projectID = await getProjectID(username, password, projectName)
  if (!projectID) {
    return res.status(500).json({ error: 'Project not found.', success: false })
  }
  const sprintName = req.body.sprintName
  const sprint = await getSprintByName(sprintName, token, projectID)
  if (sprint.success) {
    const sprintId = sprint.sprint.id
    try {
      const editedSprint = await editSprint(token, sprintId, patch)
      res.status(201).json(editedSprint)
    } catch (error) {
      res.status(500).json({ error: 'Error editing sprint' })
    }
  } else {
    res.status(500).json({ error: 'Error editing sprint' })
  }
})

app.delete('/deleteSprintByName', async (req, res) => {
  let token = req.body.token
  const { username, password } = req.body
  if (!token) {
    token = await getToken(username, password)
  }
  const projectName = req.body.projectName
  if (!projectName) {
    return res.status(500).json({ error: 'Project Name is not sent in request body.', success: false })
  }
  const projectID = await getProjectID(username, password, projectName)
  if (!projectID) {
    return res.status(500).json({ error: 'Project not found.', success: false })
  }
  const sprintName = req.body.sprintName
  if (!sprintName) {
    return res.status(500).json({ error: 'Sprint Name is not sent in request body.', success: false })
  }
  const sprint = await getSprintByName(sprintName, token, projectID)
  if (sprint.success) {
    const sprintId = sprint.sprint.id
    try {
      const status = await deleteSprint(token, sprintId)
      const ack = {
        sprintID: sprintId,
        sprintName: sprint.sprint.name,
        status: 'Deleted Successfully',
        TaigaAPIResponseStatus: status
      }
      res.status(201).send(ack)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  } else {
    res.status(500).json({ error: sprint.error })
  }
})

app.post('/createSprint', async (req, res) => {
  let token = req.body.token
  const { username, password } = req.body
  if (!token) {
    token = await getToken(username, password)
  }
  const sprint = req.body.sprint
  const { projectName } = sprint
  if (!projectName) {
    return res.status(500).json({ error: 'Project Name is not sent in request body.', success: false })
  }
  const projectID = await getProjectID(username, password, projectName)
  if (!projectID) {
    return res.status(500).json({ error: 'Project not found.', success: false })
  }
  sprint.project = projectID
  delete sprint.projectName
  try {
    const createdSprint = await createSprint(token, sprint)
    res.status(201).json(createdSprint)
  } catch (error) {
    res.status(500).json({ error: 'Error creating sprint' })
  }
})

const port = 3010
// Start the server
app.listen(port, () => {
  console.log(
    `Sprint microservice running at http://localhost:${port}`
  )
})

module.exports = app
