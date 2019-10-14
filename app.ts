import bodyParser from "body-parser";
import express from "express";

import users from "./users.json";

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (_, res) => {
  res.sendStatus(200);
});

app.get("/users", (_, res) => {
  res.json(users);
});

app.get("/users/:id", (req, res) => {
  const userID = req.params.id;
  const user = users.find(user => user.id === userID);

  if (!user) {
    res.json({ message: `'${userID}' is not exist.` });
  }

  res.json(user);
});

app.post("/users", (req, res) => {
  const user = req.body;

  const isExistingUser = users.findIndex(_user => _user.id === user.id) > -1;
  if (isExistingUser) {
    res.json({ message: `'${user.id}' is already exist.` });
  }

  users.push(user);

  res.json(users);
});

app.put("/users/:id", (req, res) => {
  const userID = req.params.id;
  const newUser = req.body;

  const index = users.findIndex(user => user.id === userID);
  if (index === -1) {
    res.json({ message: `'${userID}' is not exist.` });
  }

  users[index] = newUser;

  res.json(users);
});

app.delete("/users/:id", (req, res) => {
  const userID = req.params.id;

  const index = users.findIndex(user => user.id === userID);
  if (index === -1) {
    res.json({ message: `'${userID}' is not exist.` });
  }

  users.splice(index, 1);

  res.json(users);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
