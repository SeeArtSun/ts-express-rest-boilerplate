import mysql, { Pool, PoolConnection } from "mysql";

class MyPool {
  public pool: Pool;

  constructor() {
    this.pool = mysql.createPool({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      port: Number(process.env.MYSQL_PORT),
      database: process.env.MYSQL_DATABASE,
      connectionLimit: 10
    });
  }

  public getConnection = (): Promise<PoolConnection> => {
    return new Promise((resolve, reject) => {
      this.pool.getConnection((err, connection) => {
        if (err) {
          return reject(err);
        }

        resolve(connection);
      });
    });
  };

  public query = (connection: PoolConnection, sql: string) => {
    return new Promise((resolve, reject) => {
      connection.query(sql, (err, rows) => {
        if (err) {
          return reject(err);
        }

        resolve(rows);
      });
    });
  };
}

export default MyPool;
