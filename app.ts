import bodyParser from "body-parser";
import express from "express";

import users from "./api/v1/users";
import authorization from "./api/v1/authorization";
import db from "./database/connection";

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const router = express.Router();
app.use("/api/v1", router);
/**
 * MiddleWare for jwt Authorization
 */
// router.use(authorization);
router.use(users);

db.connect();

app.get("/", async (_, res) => {
  const createUserTableQueryString = `
    CREATE TABLE user (
      id          VARCHAR(36)   NOT NULL,
      name        VARCHAR(20),
      phonenumber VARCHAR(15),
      birthday    VARCHAR(8),
      status      VARCHAR(15),

      CONSTRAINT USER_PK PRIMARY KEY (id)
    );
  `;

  db.query(createUserTableQueryString, (err, result) => {
    if (err) {
      console.warn(err);
    }
    console.log(result);

    return result;
  });

  res.sendStatus(200);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
