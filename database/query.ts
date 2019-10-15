import { Connection } from "mysql";

const query = (connection: Connection, sql: string) => {
  return new Promise((resolve, reject) => {
    connection.query(sql, (err, rows) => {
      if (err) {
        return reject(err);
      }

      resolve(rows);
    });
  });
};

export default query;
