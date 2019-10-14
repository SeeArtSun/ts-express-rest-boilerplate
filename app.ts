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

  users.push(user);

  res.json(users);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
