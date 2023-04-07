const express = require("express");
const { getToken, createEpic } = require("./logic");

const app = express();
const port = 3006;

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

// Endpoint for creating a new epic
app.post("/createEpic", async (req, res) => {
  const { username, password, project_id, name, description } = req.body;
  const token = await getToken(username, password);
  const epicData = await createEpic(name, project_id, description, token);
  if (!epicData.success) {
    return res.status(500).send(epicData);
  }
  return res.status(201).send(epicData);
});

// Start the server
app.listen(port, () => {
  console.log(
    `Create Epic microservice running at http://localhost:${port}`
  );
});

module.exports = app;
