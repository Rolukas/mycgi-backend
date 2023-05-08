const { Pool } = require("pg");

// const pool = new Pool({
//   host: "localhost",
//   user: "postgres",
//   password: "",
//   database: "mycgi",
//   port: "5432",
//   ssl: { rejectUnauthorized: false },
// });

const prodStr = process.env.POSTGRES_URL + "?sslmode=require";
const localStr = 'postgresql://postgres:""@localhost:5432/mycgi';

const useProd = true;

const pool = new Pool({
  connectionString: useProd ? prodStr : localStr,
  ssl: !useProd ? { rejectUnauthorized: false } : true,
});
module.exports = pool;
