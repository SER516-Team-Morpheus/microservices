const express = require("express");
const { AddHappiness } = require("./logic");

const app = express();
const port = 3030;

app.use(express.json());




// Endpoint for adding bv as a custom field
app.post("/AddHappiness", async (req, res) => {
  const { username, password, projectId, name, description } = req.body
  let { token } = req.body
  if (!token) {
    token = await getToken(username, password)
  }
  const projectData = await AddHappiness(name, project, token);
  if (!projectData.success) {
    return res.status(500).send({
      success: false,
      message: "Error adding Happiness value",
    });
  }
  return res.status(201).send(projectData);
});


// Function to get auth token from authenticate api
async function getToken (username, password) {
  try {
    const response = await axios.post(AUTH_URL, {
      type: 'normal',
      username,
      password
    })
    if (response.data.auth_token) {
      return response.data.auth_token
    } else {
      return { auth_token: 'NULL' }
    }
  } catch (error) {
    return { auth_token: 'NULL' }
  }
}


// Start the server
app.listen(port, () => {
  console.log(
    `Happiness value microservice running at http://localhost:${port}`
  );
});

module.exports = app;
