import sql from 'mssql';

const config = {
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  server: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  options: {
    encrypt: false, // MSSQL local
    trustServerCertificate: true,
  },
};

let pool;

export default {
  query: async (query, params = {}) => {
    if (!pool) pool = await sql.connect(config);
    const request = pool.request();
    Object.keys(params).forEach((key) => request.input(key, params[key]));
    return request.query(query);
  }
};
