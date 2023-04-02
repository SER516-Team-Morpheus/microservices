const express = require('express');
const app = express();
const { getAllSprints, getSprintById, createSprint, deleteSprint } = require('./logic');

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});

app.get('/sprints', async (req, res) => {
  const token = req.headers.authorization;
  const projectId = req.headers.projectid;
  try {
    const sprints = await getAllSprints(token, projectId);
    res.status(200).json(sprints);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retrieving sprints' });
  }
});

app.get('/sprints/:sprintId', async (req, res) => {
  const token = req.headers.authorization;
  const { sprintId } = req.params;
  try {
    const sprint = await getSprintById(token, sprintId);
    res.status(200).json(sprint);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retrieving sprint' });
  }
});

app.post('/sprints', async (req, res) => {
  const token = req.headers.authorization;
  const sprint = req.body;
  try {
    const createdSprint = await createSprint(token, sprint);
    res.status(201).json(createdSprint);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating sprint' });
  }
});


/*
Needs Fix
*/
app.delete('/sprints/:sprintId', async (req, res) => {
  const token = req.headers.authorization;
  const sprintId = req.params;
  try {
    const deletedSprint = await deleteSprint(token, sprintId);
    res.status(201).json(deletedSprint);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

const port = 3010;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
}); 
