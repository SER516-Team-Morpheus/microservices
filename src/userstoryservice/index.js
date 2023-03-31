const express = require("express");
const { createUserstory} = require("./logic");
const {updateUserstory} = require("./logic");
const {getToken} = require("./logic");
const {getUserStoryDetails} = require("./logic");

const app = express();
const port = 3003;

app.use(express.json());


// Endpoint for creating a new user story
app.post("/createUserstory", async (req, res) => {
  const { project, subject } = req.body;
  const token = req.headers.authorization.split(" ")[1];
  const userstoryData = await createUserstory(project, subject, token);
  if (!userstoryData.success) {
    return res.status(500).send({
      userstoryData,
    });
  }
  return res.status(201).send(userstoryData);
});

//Endpoint for getting  all user stories details
app.get("/getAllUserStoryDetails", async (req, res) => {
  const { username, password, projectname,userstoryname } = req.body;
  const token = await getToken(username, password);
  const slugName = username.toLowerCase() + "-" + projectname.toLowerCase();
  const userstoryDetails = await getUserStoryDetails(token, slugName,userstoryname);
  if (!userstoryDetails.success) {
    return res.status(500).send({
      userstoryDetails,
    });
  }
  return res.status(201).send(userstoryDetails);
});

// Endpoint for updating a user story
app.patch("/updateUserstory", async (req, res) => {
  const userstoryId  = req.body.id;
  const version = req.body.version;
  var parameters = {};
  if(req.body.description !== undefined) {
    parameters.description = req.body.description;
  }
  /*if(req.body.assigned_to !== undefined) {
    parameters.assigned_to = req.body.assigned_to;
  }*/
  if(req.body.is_closed !== undefined) {
    parameters.is_closed = req.body.is_closed;
  }
  if(req.body.tags !== undefined) {
    parameters.tags = req.body.tags;
    }
  parameters.version = version;
  const token = req.headers.authorization.split(" ")[1];
  const userstoryData = await updateUserstory(userstoryId, parameters, token);
  if (!userstoryData.success) {
    return res.status(500).send({
      userstoryData,
    });
  }
  return res.status(201).send(userstoryData);
});

// Start the server
app.listen(port, () => {
  console.log(`User story microservice running at http://localhost:${port}`);
});

module.exports = app;
