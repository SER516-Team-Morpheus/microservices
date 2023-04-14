// This will have your endpoints of your microservices.
const express = require('express')
const bodyParser = require('body-parser')
const { getToken, getAllRoles, createRoles, updateRole, deleteRole } = require('./logic')

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

// Endpoint for geting a role
app.get('/getroles', async (req, res) => {
  const { username, password, projectName } = req.query
  const token = await getToken(username, password)
  const slugName = `${username.toLowerCase()}-${projectName.toLowerCase()}`
  const projectDataRoles = await getAllRoles(token, slugName)
  if (!projectDataRoles.success) {
    return res.status(404).send(projectDataRoles)
  }
  return res.send(projectDataRoles)
})

// Endpoint for updating the role
app.patch('/updateroles', async (req, res) => {
  const { username, password, roleName, newRoleName, projectName } = req.body
  const token = await getToken(username, password)
  const slugName = `${username.toLowerCase()}-${projectName.toLowerCase()}`
  const projectData = await getAllRoles(token, slugName)
  if (!projectData.success) {
    return res.status(404).send(projectData)
  }
  const roleId = projectData.roles.find(role => role.roleName === roleName)?.roleId
  console.log(roleId)
  if (!roleId) {
    return res.status(404).send({ success: false, message: 'Role not found' })
  }
  const roleData = await updateRole(token, roleId, newRoleName)
  if (!roleData.success) {
    return res.status(500).send(roleData)
  }
  return res.status(200).send(roleData)
})

// endpoint to delete a role
app.delete('/deleteroles/:roleName', async (req, res) => {
  const { username, password, projectName } = req.query
  const token = await getToken(username, password)
  const slugName = `${username.toLowerCase()}-${projectName.toLowerCase()}`
  const projectData = await getAllRoles(token, slugName)
  if (!projectData.success) {
    return res.status(404).send(projectData)
  }
  const roleId = projectData.roles.find(role => role.roleName === req.params.roleName)?.roleId
  if (!roleId) {
    return res.status(404).send({ success: false, message: 'Role not found' })
  }
  const roleData = await deleteRole(token, roleId)
  if (!roleData.success) {
    return res.status(500).send(roleData)
  }
  return res.status(200).send(roleData)
})
// Start the server
app.listen(port, () => {
  console.log(`Role microservice running at http://localhost:${port}`)
})
module.exports = app
