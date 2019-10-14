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

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
