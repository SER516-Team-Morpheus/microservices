const express = require("express");
//const { createTask } = require("./logic");
//const { getUserStoryDetails } = require("./logic");
const { getToken, getTaskDetails,getUserStoryDetails,createTask } = require("./logic")

const app = express();
const port = 3004;

app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});

// Endpoint for creating a new task
app.post("/createTask", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const projectname = req.body.projectname;
  const userstoryname = req.body.userstoryname;
  const subject = req.body.taskname;

  const token = await getToken(username, password);
  const slugName = username.toLowerCase() + "-" + projectname.toLowerCase();
  const userstoryDetails = await getUserStoryDetails(token, slugName,userstoryname);
  if(userstoryDetails.success == false)
  {
     return res.status(500).send({"message" : "Error in getting user story details"})
  }
  else{
    const taskData = await createTask(userstoryDetails.parameters.projectid, userstoryDetails.parameters.id, subject, token);
    if (!taskData.success) {
      return res.status(500).send({
        taskData,
      });
    }
    return res.status(201).send(taskData);
  }
});

app.post("/updateTask", async (req, res) => {

  const username = req.body.username;
  const password = req.body.password;
  const projectname = req.body.projectname;
  const userstoryname = req.body.userstoryname;
  const taskname = req.body.taskname;

  const token = await getToken(username, password);
  const slugName = username.toLowerCase() + "-" + projectname.toLowerCase();
  const taskDetails = await getTaskDetails(token, slugName,taskname);
  console.log(taskDetails);


});

// Start the server
app.listen(port,  () => {
  console.log(`Task microservice running at http://localhost:${port}`);
});

module.exports = app;