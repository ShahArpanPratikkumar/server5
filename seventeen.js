const express = require("express");

const app = express();

app.use(express.json());


// Sample Data
let users = [
  {
    uid: 108243,
    att: "80",
    total_sub: 14,
    bonus: "20",
    name: "dax"
  }
];


// Home Route
app.get("/", (req, res) => {
  res.send("Express server is running");
});


// GET All Users
app.get("/users", (req, res) => {
  res.status(200).json(users);
});


// GET User By UID
app.get("/users/:uid", (req, res) => {

  const uid = Number(req.params.uid);

  const user = users.find(u => u.uid === uid);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json(user);
});


// POST User (Add New User)
app.post("/users", (req, res) => {

  const { uid, att, total_sub, bonus, name } = req.body;

  // Validation
  if (!uid || !name) {
    return res.status(400).json({
      message: "uid and name are required"
    });
  }

  // Check Duplicate
  const exists = users.find(u => u.uid === uid);

  if (exists) {
    return res.status(400).json({
      message: `User with uid ${uid} already exists`
    });
  }

  const newUser = {
    uid,
    att,
    total_sub,
    bonus,
    name
  };

  users.push(newUser);

  res.status(201).json({
    message: "User added successfully",
    user: newUser
  });
});


// PUT → Update User
app.put("/users/:uid", (req, res) => {

  const uid = Number(req.params.uid);

  const index = users.findIndex(u => u.uid === uid);

  if (index === -1) {
    return res.status(404).json({ message: "User not found" });
  }

  users[index] = {
    ...users[index],
    att: req.body.att,
    total_sub: req.body.total_sub,
    bonus: req.body.bonus,
    name: req.body.name
  };

  res.status(200).json({
    message: "User updated successfully",
    user: users[index]
  });
});



// PATCH → Partial Update User
app.patch("/users/:uid", (req, res) => {

  const uid = Number(req.params.uid);

  const user = users.find(u => u.uid === uid);

  if (!user) {
    return res.status(404).json({
      message: "User not found"
    });
  }

  // Only update fields if they exist in body
  if (req.body.att !== undefined) {
    user.att = req.body.att;
  }

  if (req.body.total_sub !== undefined) {
    user.total_sub = req.body.total_sub;
  }

  if (req.body.bonus !== undefined) {
    user.bonus = req.body.bonus;
  }

  if (req.body.name !== undefined) {
    user.name = req.body.name;
  }

  res.status(200).json({
    message: "User updated successfully (PATCH)",
    user: user
  });
});



// DELETE → Remove User
app.delete("/users/:uid", (req, res) => {

  const uid = Number(req.params.uid);

  const index = users.findIndex(u => u.uid === uid);

  if (index === -1) {
    return res.status(404).json({ message: "User not found" });
  }

  const deletedUser = users.splice(index, 1);

  res.status(200).json({
    message: "User deleted",
    user: deletedUser[0]
  });
});


// Start Server
app.listen(5000, () => {
  console.log("Server started on port 5000");
});
