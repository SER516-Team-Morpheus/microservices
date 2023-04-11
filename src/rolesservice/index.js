// This will have your endpoints of your microservices.
const express = require('express')
const bodyParser = require('body-parser')
const logic = require('./logic')
const { getToken, getAllRoles, createRoles } = require('./logic')

const app = express()
app.use(bodyParser.json())

const port = 3008

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

// Endpoint for creating a role
app.post('/createroles', async (req, res) => {
  const { username, password, roleName, projectName } = req.body
  const token = await getToken(username, password)
  const slugName = `${username.toLowerCase()}-${projectName.toLowerCase()}`
  const projectData = await getAllRoles(token, slugName)
  const projectId = projectData.projectId
  if (!projectData.success) {
    return res.status(404).send(projectData)
  }
  const roleData = await createRoles(token, roleName, projectId)
  if (!roleData.success) {
    return res.status(500).send(roleData)
  }
  return res.status(201).send(roleData)
})

// Endpoint for updating a role
app.patch('/updateroles/:roleId', async (req, res, next) => {
  const { roleId } = req.params
  const { name, order, computable, permissions } = req.body

  try {
    const role = await logic.updateRole(
      roleId,
      name,
      order,
      computable,
      permissions
    )
    res.status(201).json(role)
  } catch (error) {
    next(error)
  }
})

// Endpoint for geting a role
app.get('/getroles', async (req, res) => {
  const { username, password, projectName } = req.query
  const token = await getToken(username, password)
  const slugName = `${username.toLowerCase()}-${projectName.toLowerCase()}`
  const projectDataRoles = await getAllRoles(token, slugName)
  if (!projectDataRoles.success) {
    return res.status(404).send(projectData)
  }
  return res.send(projectDataRoles)
})

// Start the server
app.listen(port, () => {
  console.log(`Role microservice running at http://localhost:${port}`)
})
module.exports = app
