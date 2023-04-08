const express = require("express");
const { createMember,getRoleId,getToken,getMembers,deleteMember } = require("./logic");

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


// Endpoint for creating a new member
app.post("/createMember", async (req, res) => {
    const { username, password, member, projectId } = req.body;
    const token = await getToken(username, password);
    const roleId = await getRoleId(token, projectId);
    const memberData = await createMember(member, projectId, roleId, token);
    if (!memberData.success) {
      return res.status(500).send({
        success: false,
        message: "Error creating member",
      });
    }

    return res.status(201).send(memberData);
  });
  
//Endpoint for getting  all members details
app.get("/getMembers", async (req, res) => {
  const { username, password, projectId } = req.body;
  const token = await getToken(username, password);
  const memberData = await getMembers(token, projectId);
  if(memberData.success){
  const result = memberData.data.map(member => ({
    id: member.id,
    email: member.email,
    full_name: member.full_name,
    role: member.role_name,
  }));
  return res.status(201).send({ success: true, body: result });
}
  return res.status(500).send(memberData);

});

// Endpoint for deleting a member
app.delete("/deleteMember/:id", async (req, res) => {
  const { username, password, projectId } = req.body;
  const token = await getToken(username, password);
  const memberId = req.params.id;

  const memberData = await deleteMember(memberId, projectId, token);

  if (!memberData.success) {
    console.log("faildebug")
    return res.status(500).send({
      success: false,
      message: "Error deleting member",
    });
  }

  return res.status(201).send({ success: true, message: "Member successfully deleted" });
});

//editing the role of a member
app.patch("/editMemberRole", async (req, res) => {
  const { username, password, roleId,memberId } = req.body;
  const token = await getToken(username, password);
  const memberData = await getMembers(token, projectId);
  if(memberData.success){
  const result = memberData.data.map(member => ({
    id: member.id,
    email: member.email,
    full_name: member.full_name,
    role: member.role_name,
  }));
  return res.status(201).send({ success: true, body: result });
}
  return res.status(500).send(memberData);

});

  // Start the server
  app.listen(port, () => {
    console.log(
      `Create Member microservice running at http://localhost:${port}`
    );
  });
  
  module.exports = app;