import * as mysql from 'mysql';
import dotenv from 'dotenv';

dotenv.config();

/**
 * generates pool connection to be used throughout the app
 */
let pool: mysql.Pool;
const connection = () => {
  try{
    pool = mysql.createPool({
      connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT as string),
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT as string),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    console.debug('✅ Connection to database established');
  } catch(error) {
    console.error('❌ Error while connecting to database', error);
  }
}
const db = connection;

/**
 * executes SQL queries in MySQL db
 *
 * @param {string} query - provide a valid SQL query
 * @param {string[] | Object} params - provide the parameterized values used
 * in the query
 */
 export const execute = <T>(query: string, params: string[] | Object): Promise<T> => {
  try {
    if (!pool) throw new Error('Pool was not created. Ensure pool is created when running the app.');

    return new Promise<T>((resolve, reject) => {
      pool.query(query, params, (error, results) => {
        if (error) reject(error);
        else resolve(results);
      });
    });

  } catch (error) {
    console.error('❌ [mysql.connector][execute][Error]: ', error);
    throw new Error('failed to execute MySQL query');
  }
}

export default db;