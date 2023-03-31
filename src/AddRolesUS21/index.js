//This will have your endpoints of your microservices.
const express = require("express");
const {createRoles,updateRole,getRoleDetails} = require("./logic");


const app = express();
const port = 3004;

app.use(express.json());

// Endpoint for creating a role
app.post("/createRoles", async (req, res) => {
  const { name, token } = req.body;
  const result = await createRoles(name, token);
  if (result.success) {
    res.status(202).json(result);
  } else {
    res.status(500).json(result);
  }
});

// Endpoint for updating a role
app.patch("/updateRole", async (req, res) => {
  const { roleId, parameters, token } = req.body;
  const result = await updateRole(roleId, parameters, token);
  if (result.success) {
    res.status(202).json(result);
  } else {
    res.status(500).json(result);
  }
});

// Endpoint for getting role details
app.get("/getRoleDetails", async (req, res) => {
  const { token, slugName, roleName } = req.query;
  const result = await getRoleDetails(token, slugName, roleName);
  if (result.success) {
    res.status(202).json(result);
  } else {
    res.status(500).json(result);
  }
});



// Start the server
app.listen(port, () => {
    console.log(
      `Add roles microservice running at http://localhost:${port}`
    );
  });
  
  module.exports = app;