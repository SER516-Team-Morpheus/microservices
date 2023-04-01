const express = require("express");
const {
  getProjectBySlug,
  getToken,
  createUserstory,
  updateUserstory,
  getUserStoryDetails,
} = require("./logic");

const app = express();
const port = 3003;

app.use(express.json());

// Endpoint for creating a new user story
app.post("/createUserstory", async (req, res) => {
  const { username, password, projectName, subject } = req.body;
  const token = await getToken(username, password);
  const projectData = await getProjectBySlug(username, password, projectName);
  if (!projectData.success) {
    return res.status(500).send(projectData);
  }
  const projectId = projectData.projectId;
  const userstoryData = await createUserstory(projectId, subject, token);
  if (userstoryData.success) {
    return res.status(201).send(userstoryData);
  } else {
    return res.status(500).send(userstoryData);
  }
});

//Endpoint for getting  all user stories details
app.get("/getAllUserStoryDetails", async (req, res) => {
  const { username, password, projectname, userstoryname } = req.body;
  const token = await getToken(username, password);
  const slugName = username.toLowerCase() + "-" + projectname.toLowerCase();
  const userstoryDetails = await getUserStoryDetails(
    token,
    slugName,
    userstoryname
  );
  if (!userstoryDetails.success) {
    return res.status(500).send({
      userstoryDetails,
    });
  }
  return res.status(201).send(userstoryDetails);
});

// Endpoint for updating a user story
app.patch("/updateUserstory", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const projectname = req.body.projectname;
  const userstoryname = req.body.userstoryname;
  const token = await getToken(username, password);
  const slugName = username.toLowerCase() + "-" + projectname.toLowerCase();
  const userstoryDetails = await getUserStoryDetails(
    token,
    slugName,
    userstoryname
  );
  if (!userstoryDetails.success) {
    return res.status(500).send({
      userstoryDetails,
    });
  } else {
    const userstoryId = userstoryDetails.parameters.id;
    const version = userstoryDetails.parameters.version;
    var parameters = {};
    if (req.body.description !== undefined) {
      parameters.description = req.body.description;
    }
    /*if(req.body.assigned_to !== undefined) {
    parameters.assigned_to = req.body.assigned_to;
  }*/
    if (req.body.is_closed !== undefined) {
      parameters.is_closed = req.body.is_closed;
    }
    if (req.body.tags !== undefined) {
      parameters.tags = req.body.tags;
    }
    var points = {};
    if (req.body.points !== undefined) {
      var roles = {
        UX: 4339586,
        Design: 4339587,
        Front: 4339588,
        Back: 4339589,
      };
      var userpoint = {
        "?": 0,
        0: 1,
        "1/2": 2,
        1: 3,
        2: 4,
        3: 5,
        5: 6,
        8: 7,
        10: 8,
        13: 9,
        20: 10,
        40: 11,
      };

      for (var key in req.body.points) {
        var value = req.body.points[key];
        var newKey = roles[key];
        var newValue = userpoint[value];
        points[newKey] = 8615602 + newValue;
      }

      parameters.points = points;
    }
    parameters.version = version;

    const userstoryData = await updateUserstory(userstoryId, parameters, token);
    console.log(userstoryData);
    if (!userstoryData.success) {
      return res.status(500).send({
        userstoryData,
      });
    }
    return res.status(201).send(userstoryData);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`User story microservice running at http://localhost:${port}`);
});

module.exports = app;
