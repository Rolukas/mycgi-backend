const { Pool } = require("pg");

// const pool = new Pool({
//   host: "localhost",
//   user: "postgres",
//   password: "",
//   database: "mycgi",
//   port: "5432",
//   ssl: { rejectUnauthorized: false },
// });

const prodStr =
  "postgres://default:na43XGVecIfO@ep-muddy-fog-536071.us-west-2.postgres.vercel-storage.com:5432/verceldb";
const localStr = 'postgresql://postgres:""@localhost:5432/mycgi';

const pool = new Pool({
  connectionString: prodStr,
  ssl: false,
});
module.exports = pool;
