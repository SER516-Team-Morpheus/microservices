const express = require("express");
//const { createTask } = require("./logic");
//const { getUserStoryDetails } = require("./logic");
const { getToken, getTaskDetails,getUserStoryDetails,createTask, updateTaskDetails} = require("./logic")

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
  if (!taskDetails.success) {
    return res.status(500).send({
      taskDetails,
    });
  } 
  else {
    const taskId = taskDetails.parameters.id;
    var parameters = {};
    if(req.body.status != undefined)
    {
      var status = {
        "new":3572652,
        "in progress": 3572653,
        "ready for test" :3572654,
        "closed":3572655,
        "done":3572655,
        "needs info":3572656
      }
      parameters.status = status[req.body.status.toLowerCase()];
    }
    if (req.body.description !== undefined) {
      parameters.description = req.body.description;
    }
    if (req.body.assigned_to !== undefined){
      parameters.assigned_to = req.body.assigned_to;
    }
    parameters.version = taskDetails.parameters.version;
    const taskUpdateData = await updateTaskDetails(token, taskId, parameters);
    if (!taskUpdateData.success) {
      return res.status(500).send({
        taskUpdateData,
      });
    }
    return res.status(201).send(taskUpdateData);

  }

});

// Start the server
app.listen(port,  () => {
  console.log(`Task microservice running at http://localhost:${port}`);
});

module.exports = app;