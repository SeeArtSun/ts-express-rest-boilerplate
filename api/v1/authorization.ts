import { Request, Response, NextFunction } from "express-serve-static-core";
import jwt from "jsonwebtoken";

const authorization = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization!.replace(/^Bearer /, "");

    jwt.verify(token, process.env.JWT_SECRET_KEY!, { algorithms: ["HS256"] });

    next();
  } catch (err) {
    res.sendStatus(401);
  }
};

export default authorization;
