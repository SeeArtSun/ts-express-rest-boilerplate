import bodyParser from "body-parser";
import express from "express";

import users from "./api/v1/users";
import authorization from "./api/v1/authorization";

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

app.get("/", async (_, res) => {
  res.sendStatus(200);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
