const express = require('express')
const {
  getToken,
  getProjectBySlug,
  getMember,
  getProjectList,
  editProject,
  deleteProject,
  createProject
} = require('./logic')

const app = express()
const port = 3002

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

// Endpoint for getting project under a member account
app.get('/getProject', async (req, res) => {
  const { username, password } = req.query
  const token = await getToken(username, password)
  const memberData = await getMember(token)
  if (!memberData.success) {
    return res.status(404).send(memberData)
  }
  const memberId = memberData.memberId
  const getProjectData = await getProjectList(token, memberId)
  if (!getProjectData.success) {
    return res.status(404).send(getProjectData)
  }
  return res.send(getProjectData)
})

// Endpoint for getting project by slug name
app.get('/getProjectBySlug', async (req, res) => {
  const { username, password, name } = req.query
  const token = await getToken(username, password)
  const slugName = `${username.toLowerCase()}-${name.toLowerCase()}`
  const projectData = await getProjectBySlug(token, slugName)
  if (!projectData.success) {
    return res.status(404).send(projectData)
  }
  return res.send(projectData)
})

// Endpoint for creating a new project
app.post('/createProject', async (req, res) => {
  const { username, password, name, description } = req.body
  const token = await getToken(username, password)
  const slugName = username.toLowerCase() + '-' + name.toLowerCase()
  const checkProjectName = await getProjectBySlug(token, slugName)
  if (!checkProjectName.success) {
    const projectData = await createProject(name, description, token)
    if (!projectData.success) {
      return res.status(500).send(projectData)
    }
    return res.status(201).send(projectData)
  }
  return res.status(500).send({
    success: false,
    message: 'Same project name already exist!',
    sol: 'Try different project name.'
  })
})

// Endpoint for deleting a project
app.delete('/deleteProject/:projectID', async (req, res) => {
  let token = req.body.token
  if (!token) {
    const { username, password } = req.body
    token = await getToken(username, password)
  }
  const projectID = req.params.projectID
  try {
    const status = await deleteProject(projectID, token)
    const data = {
      // eslint-disable-next-line quote-props
      'status': status.message,
      // eslint-disable-next-line quote-props
      'TaigaAPIResponseStatus': status.success
    }
    if (status.success) {
      res.status(201).send(data)
    } else {
      res.status(500).send({
        message: 'Project ID is invalid'
      })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Endpoint for Updating a Project
app.patch('/updateProject/:projectID', async (req, res) => {
  let token = req.body.token
  if (!token) {
    const { username, password } = req.body
    token = await getToken(username, password)
  }
  const projectID = req.params.projectID
  const patch = req.body.patch
  try {
    const projectData = await editProject(token, projectID, patch)
    // eslint-disable-next-line eqeqeq
    if (projectData.status == 'success') {
      res.status(201).json(projectData.data)
    } else {
      res.status(500).json({
        message: 'Error in editing project name'
      })
    }
  } catch (error) {
    res.status(500).json({ error: 'Error editing project' })
  }
})

// Start the server
app.listen(port, () => {
  console.log(
    `Create Project microservice running at http://localhost:${port}`
  )
})

module.exports = app
