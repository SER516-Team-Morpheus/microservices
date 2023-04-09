// This will have your endpoints of your microservices.
const express = require('express');
const bodyParser = require('body-parser');
const logic = require('./logic');

const app = express();
app.use(bodyParser.json());

const port = 3005;

app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
});

// Endpoint for creating a role
app.post('/roles', async (req, res, next) => {
  const {
    name, project, order, computable, permissions,
  } = req.body;

  try {
    const role = await logic.createRoles(name, project, order, computable, permissions);
    res.status(201).json(role);
  } catch (error) {
    next(error);
  }
});

// Endpoint for updating a role
app.patch('/roles/:roleId', async (req, res, next) => {
  const { roleId } = req.params;
  const {
    name, order, computable, permissions,
  } = req.body;

  try {
    const role = await logic.updateRole(roleId, name, order, computable, permissions);
    res.status(200).json(role);
  } catch (error) {
    next(error);
  }
});

// Endpoint for geting a role
app.get('/roles/:roleId', async (req, res, next) => {
  const { roleId } = req.params;

  try {
    const role = await logic.getRoleDetails(roleId);
    res.status(200).json(role);
  } catch (error) {
    next(error);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Create Member addroleservice running at http://localhost:${port}`);
});
module.exports = app;