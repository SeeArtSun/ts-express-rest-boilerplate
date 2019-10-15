import mysql, { Pool, PoolConnection } from "mysql";

interface DMLResult {
  fieldCount: number;
  affectedRows: number;
  insertId: number;
  serverStatus: number;
  warningCount: number;
  message: string;
  protocol41: boolean;
  changedRows: number;
}
interface ShowColumnsItem {
  Field: string;
  Type: string;
  Null: string;
  Key: string;
  Default: string | null;
  Extra: string;
}
type ShowColumnsResult = ShowColumnsItem[];

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
export { DMLResult, ShowColumnsResult, ShowColumnsItem };
