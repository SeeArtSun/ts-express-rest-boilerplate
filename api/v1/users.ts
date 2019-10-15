import express from "express";

import users from "./users.json";

const router = express.Router();

router.get("/users", (_, res) => {
  res.json(users);
});

router.get("/users/:id", (req, res) => {
  const userID = req.params.id;
  const user = users.find(user => user.id === userID);

  if (!user) {
    res.json({ message: `'${userID}' is not exist.` });
  }

  res.json(user);
});

router.post("/users", (req, res) => {
  const user = req.body;

  const isExistingUser = users.findIndex(_user => _user.id === user.id) > -1;
  if (isExistingUser) {
    res.json({ message: `'${user.id}' is already exist.` });
    return;
  }

  users.push(user);

  res.json(users);
});

router.put("/users/:id", (req, res) => {
  const userID = req.params.id;
  const newUser = req.body;

  const index = users.findIndex(user => user.id === userID);
  if (index === -1) {
    res.json({ message: `'${userID}' is not exist.` });
    return;
  }

  users[index] = newUser;

  res.json(users);
});

router.delete("/users/:id", (req, res) => {
  const userID = req.params.id;

  const index = users.findIndex(user => user.id === userID);
  if (index === -1) {
    res.json({ message: `'${userID}' is not exist.` });
    return;
  }

  users.splice(index, 1);

  res.json(users);
});

export default router;
