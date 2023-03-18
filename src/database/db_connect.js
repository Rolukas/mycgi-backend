const { Pool } = require("pg");

// const pool = new Pool({
//   host: "localhost",
//   user: "postgres",
//   password: "",
//   database: "mycgi",
//   port: "5432",
//   ssl: { rejectUnauthorized: false },
// });

const pool = new Pool({
  connectionString: 'postgresql://postgres:""@localhost:5432/mycgi',
  ssl: false,
});
module.exports = pool;
