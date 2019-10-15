import express from "express";
import uuid from "uuid/v4";

import users from "./users.json";
import MyPool from "../../database/mysql";

interface User {
  id: string;
  name: string;
  birthday?: string;
  phonenumber?: string;
  status: "verified" | "guest" | "leaved";
}
interface Result {
  message: string;
  items?: User[];
  item?: User;
}

const router = express.Router();
const myPool = new MyPool();

router.get("/users", async (_, res) => {
  const connection = await myPool.getConnection();

  const getUsersQueryString = `
    SELECT *
      FROM user
    ;
  `;
  const queryResult = (await myPool.query(
    connection,
    getUsersQueryString
  )) as User[];

  connection.release();

  const respone: Result = { message: "Success", items: queryResult };
  res.json(respone);
});

router.get("/users/:id", async (req, res) => {
  const userID = req.params.id;
  const connection = await myPool.getConnection();

  const getUserQueryString = `
    SELECT *
      FROM user
     WHERE id = '${userID}'
    ;
  `;
  const queryResult = (await myPool.query(
    connection,
    getUserQueryString
  )) as User[];

  connection.release();

  if (!queryResult.length) {
    res.json({ message: `'${userID}' is not exist.` });
    return;
  }

  const respone: Result = { message: "Success", item: queryResult[0] };
  res.json(respone);
});

router.post("/users", (req, res) => {
  const user = { ...req.body, id: uuid() };

  const isExistingUser =
    users.findIndex(
      _user => _user.phonenumber && _user.phonenumber === user.phonenumber
    ) > -1;
  if (isExistingUser) {
    res.json({ message: `'${user.name}' is already exist.` });
    return;
  }

  users.push(user);

  res.json(users);
});

router.put("/users/:id", (req, res) => {
  const userID = req.params.id;
  const newUser = { ...req.body, id: userID };

  const index = users.findIndex(user => user.id === userID);
  const isExistingUser = index > -1;

  if (isExistingUser) {
    users[index] = newUser;
  } else {
    users.push(newUser);
  }

  res.json(users);
});

router.patch("/users/:id", (req, res) => {
  const userID = req.params.id;
  const query = req.query;

  const index = users.findIndex(user => user.id === userID);

  if (index === -1) {
    res.json({ message: `'${userID}' is not exist.` });
    return;
  }

  users[index] = { ...users[index], ...query };

  res.json(users[index]);
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
