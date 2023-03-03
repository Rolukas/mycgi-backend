const { Pool } = require('pg');

const pool = new Pool ({
    host: 'ec2-3-220-23-212.compute-1.amazonaws.com',
    user: 'tdrzfujtwajmbg',
    password: 'dc7a45b571bce297253a6655ea641a73dc02f28c752dd1906e8883b230dc16c1',
    database: 'digu810govk0a',
    port: '5432',
    ssl: { rejectUnauthorized: false }
});

module.exports = pool;