const { Pool } = require("pg");

const DATABASE_URL = process.env.POSTGRES_URL_NON_POOLING;

const isProduction = process.env.ENVIRONMENT === "PRODUCTION";

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: isProduction ? true : { rejectUnauthorized: false },
});

module.exports = pool;
