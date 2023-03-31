const express = require("express");
const { deleteStory } = require("./logic");

const app = express();
const port = 3010;

app.use(express.json());

// Endpoint for deleting user story
app.post("/deleteByID/", async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const ID = req.body.ID;
  const deleteData = await deleteStory(ID, token);
  if (!deleteData.success) {
    return res.status(500).send({
      success: false,
      message: "Error deleting user story",
    });
  }
  return res.status(204).send(deleteData)
});

// Start the server
app.listen(port, () => {
    console.log(
      `Create Project microservice running at http://localhost:${port}`
    );
  });

module.exports = app;
