import express from "express";

import users from "./users.json";

const app = express();
const port = process.env.PORT || 3000;

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

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
