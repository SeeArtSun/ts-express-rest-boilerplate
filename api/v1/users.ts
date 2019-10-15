import express from "express";
import uuid from "uuid/v4";

import users from "./users.json";
import MyPool, { DMLResult, ShowColumnsResult } from "../../database/mysql";

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

router.post("/users", async (req, res) => {
  const user = req.body;
  const connection = await myPool.getConnection();

  user.id = user.id || uuid();
  const columns = Object.keys(user).join(", ");
  const values = Object.values(user)
    .map(value => `'${value}'`)
    .join(", ");

  const insertQueryString = `
    INSERT INTO user (${columns})
      VALUES (${values})
    ;
  `;

  try {
    const queryResult = (await myPool.query(
      connection,
      insertQueryString
    )) as DMLResult;

    if (queryResult.affectedRows) {
      const respone: Result = { message: "Success", item: user };
      res.json(respone);
    } else {
      const respone: Result = { message: "Failed", item: user };
      res.json(respone);
    }
  } catch (error) {
    res.json({ message: `[Failed] ${error.message}`, item: user });
  } finally {
    connection.release();
  }
});

router.put("/users/:id", async (req, res) => {
  const userID = req.params.id;
  const newUser = { ...req.body, id: userID };

  const getColumnNamesQueryString = `
    SHOW columns FROM user;
  `;
  const connection = await myPool.getConnection();

  try {
    const getColumnsResult = (await myPool.query(
      connection,
      getColumnNamesQueryString
    )) as ShowColumnsResult;

    const columnNames = getColumnsResult.map(_column => _column.Field);
    const values = columnNames.map(_columnName => {
      const value = newUser[_columnName] ? `'${newUser[_columnName]}'` : "null";

      return value;
    });
    const inDupCase = columnNames
      .map(_columnName => {
        const value = newUser[_columnName]
          ? `'${newUser[_columnName]}'`
          : "null";

        return `${_columnName} = ${value}`;
      })
      .join(", ");

    const upsertQueryString = `
      INSERT INTO user (${columnNames.join(", ")})
        VALUES (${values.join(", ")})
      ON DUPLICATE KEY UPDATE
        ${inDupCase}
    `;
    await myPool.query(connection, upsertQueryString);

    const getUserQueryString = `
      SELECT *
        FROM user
       WHERE id = '${userID}';
    `;
    const queryResult = (await myPool.query(
      connection,
      getUserQueryString
    )) as User[];

    const respone: Result = { message: "Success", item: queryResult[0] };

    res.json(respone);
  } catch (error) {
    res.json({ message: `[Failed] ${error.message}`, item: newUser });
  } finally {
    connection.release();
  }
});

router.patch("/users/:id", async (req, res) => {
  const userID = req.params.id;
  const query = req.query;

  const setValues = Object.keys(query)
    .map(columnName => {
      return `${columnName} = ${
        typeof query[columnName] === "number"
          ? query[columnName]
          : `'${query[columnName]}'`
      }`;
    })
    .join(", ");
  const updateQueryString = `
    UPDATE user SET ${setValues}
     WHERE id = '${userID}';
  `;

  const connection = await myPool.getConnection();
  const updataeResult = (await myPool.query(
    connection,
    updateQueryString
  )) as DMLResult;

  const respone: Result = { message: "[Failed] not exist matched user" };

  if (updataeResult.affectedRows) {
    const getUserQueryString = `
      SELECT *
        FROM user
       WHERE id = '${userID}';
  `;
    const queryResult = (await myPool.query(
      connection,
      getUserQueryString
    )) as User[];

    respone.message = `[Success]: ${updataeResult.message}`;
    respone.item = queryResult[0];
  }

  connection.release();
  res.json(respone);
});

router.delete("/users/:id", async (req, res) => {
  const userID = req.params.id;
  const connection = await myPool.getConnection();

  const deleteQueryString = `
    DELETE FROM user
     WHERE id = '${userID}';
  `;

  try {
    const queryResult = (await myPool.query(
      connection,
      deleteQueryString
    )) as DMLResult;

    const response: Result = {
      message: queryResult.affectedRows
        ? "Success"
        : "[Failed] not exist matched user"
    };
    res.json(response);
  } catch (error) {
    res.json({ message: `[Failed] ${error.message}` });
  } finally {
    connection.release();
  }
});

export default router;
