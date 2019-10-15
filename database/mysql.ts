import { Pool, PoolConnection } from "mysql";

const getConnection = (pool: Pool): Promise<PoolConnection> => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        return reject(err);
      }

      resolve(connection);
    });
  });
};

const query = (connection: PoolConnection, sql: string) => {
  return new Promise((resolve, reject) => {
    connection.query(sql, (err, rows) => {
      if (err) {
        return reject(err);
      }

      resolve(rows);
    });
  });
};

export { getConnection, query };
