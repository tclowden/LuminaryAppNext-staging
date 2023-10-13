module.exports = {
   development: {
      url: process.env.DATABASE_URL,
      username: 'postgres',
      password: 'password',
      database: 'luminary',
      host: '127.0.0.1',
      dialect: 'postgres',
      dialectModule: require('pg'),
      pool: {
         max: 500, // Maximum number of connection instances in the pool
         min: 0, // Minimum number of connection instances in the pool
         acquire: 30000, // Maximum time (in milliseconds) that a connection can be idle before being released
         idle: 10000, // Maximum time (in milliseconds) that a connection can be idle before being closed
      },
      logging: false,
      minifyAliases: true,
   },
   production: {
      url: process.env.DATABASE_URL,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      host: process.env.POSTGRES_HOST,
      dialect: 'postgres',
      dialectModule: require('pg'),
      pool: {
         max: 10, // Maximum number of connection instances in the pool
         min: 0, // Minimum number of connection instances in the pool
         acquire: 30000, // Maximum time (in milliseconds) that a connection can be idle before being released
         idle: 10000, // Maximum time (in milliseconds) that a connection can be idle before being closed
      },
      minifyAliases: true,
      ssl: true, // <-- Added this line
      dialectOptions: {
         ssl: {
            require: true,
            rejectUnauthorized: false, // <-- You might need this depending on your setup
         },
      },
   },
};
