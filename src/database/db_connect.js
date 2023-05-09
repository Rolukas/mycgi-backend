const { Pool } = require("pg");

const DATABASE_URL =
  process.env.POSTGRES_URL_NON_POOLING ||
  'postgresql://postgres:""@localhost:5432/mycgi';

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: process.env.POSTGRES_URL_NON_POOLING ? true : false,
});

module.exports = pool;
