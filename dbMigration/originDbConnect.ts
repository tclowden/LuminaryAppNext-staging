// 'use server';
import mysql from 'mysql';

let originDb: Record<string, any> = {};
const ORIGIN_PORT = process.env.ORIGIN_PORT || 3306;

originDb = mysql.createPool({
   connectionLimit: 500,
   host: process.env.ORIGIN_HOST,
   port: parseInt(ORIGIN_PORT as string, 10),
   user: process.env.ORIGIN_DATABASE_USER,
   password: process.env.ORIGIN_DATABASE_PASSWORD,
   database: process.env.ORIGIN_DATABASE,
});


export default originDb;
