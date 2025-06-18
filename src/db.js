import { createPool } from "mysql2/promise";
import { BD_DATABASE, BD_HOST, DB_PASSWORD, DB_PORT, DB_USER } from './config.js'
export const conmysql=createPool({
    host:BD_HOST,
    database:BD_DATABASE,
    user:DB_USER,
    password:DB_PASSWORD,
    port:DB_PORT
})
