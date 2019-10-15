import bodyParser from "body-parser";
import express from "express";

import users from "./api/v1/users";

const app = express();
const port = process.env.PORT || 3000;

const router = express.Router();
app.use("/api/v1", router);
router.use(users);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (_, res) => {
  res.sendStatus(200);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
