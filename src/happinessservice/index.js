const express = require("express");
const { AddBV } = require("./logic");

const app = express();
const port = 3030;

app.use(express.json());




// Endpoint for adding bv as a custom field
app.post("/AddHappiness", async (req, res) => {
  const { name, project, token } = req.body;
  if (!token){
        token = req.headers.authorization.split(" ")[1];
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





// Start the server
app.listen(port, () => {
  console.log(
    `Happiness value microservice running at http://localhost:${port}`
  );
});

module.exports = app;
