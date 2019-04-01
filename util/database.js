const sql = require('mssql');

const config = {
  user: 'test',
  password: 'test',
  server: '192.168.5.45',
  database: 'nodejs'
};

async function createPool() {
  try {
    const pool = await new sql.ConnectionPool(config).connect();

    if (pool) {
      console.log('Connnected to MSSQL');
    }
    return pool;
  } catch (err) {
    console.log('Database Connection Failed! Bad Config', err);
  }
}

module.exports = {
  pool: createPool(),
  sql
};
