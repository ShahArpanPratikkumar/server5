const express = require("express");

const app = express();

app.use(express.json());


// Sample Data

const users = [
  { id: 1, name: "Arjun", role: "student" },
  { id: 2, name: "Priyesha", role: "mentor" }
];


// Home Route
app.get("/", (req, res) => {
  res.send("Express server is running");
});


// GET All Users
app.get("/users", (req, res) => {
  res.status(200).json(users);
});


// GET User By ID
app.get("/users/:id", (req, res) => {
  const userId = Number(req.params.id);

  const user = users.find(u => u.id === userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json(user);
});


// POST User (Single / Multiple With ID)
app.post("/users", (req, res) => {

  // MULTIPLE
  if (Array.isArray(req.body)) {

    const newUsers = [];

    for (let user of req.body) {

      const exists = users.find(u => u.id === user.id);

      if (exists) {
        return res.status(400).json({
          message: `User with id ${user.id} already exists`
        });
      }

      newUsers.push({
        id: user.id,
        name: user.name,
        role: user.role
      });
    }

    users.push(...newUsers);

    return res.status(201).json({
      message: "Multiple users added",
      users: newUsers
    });
  }

  // SINGLE
  else {

    const { id, name, role } = req.body;

    const exists = users.find(u => u.id === id);

    if (exists) {
      return res.status(400).json({
        message: `User with id ${id} already exists`
      });
    }

    const newUser = { id, name, role };

    users.push(newUser);

    return res.status(201).json({
      message: "User added",
      user: newUser
    });
  }
});


// PUT → Update User By ID
app.put("/users/:id", (req, res) => {

  const userId = Number(req.params.id);

  const index = users.findIndex(u => u.id === userId);

  if (index === -1) {
    return res.status(404).json({ message: "User not found" });
  }

  users[index] = {
    id: userId,
    name: req.body.name,
    role: req.body.role
  };

  res.status(200).json({
    message: "User updated successfully",
    user: users[index]
  });
});


// DELETE → Remove User By ID
app.delete("/users/:id", (req, res) => {

  const userId = Number(req.params.id);

  const index = users.findIndex(u => u.id === userId);

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
app.listen(3000, () => {
  console.log("Server started on port 3000");
});
