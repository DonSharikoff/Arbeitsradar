require('dotenv').config();

module.exports = {
  mongodb: {
    url: `mongodb://${process.env.DATABASE_HOST}/`,
    databaseName: process.env.DATABASE_NAME,
    options: {
      auth: {
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
      },
    },
  },

  migrationsDir: 'migrations',
  changelogCollectionName: 'changelog',
  migrationFileExtension: '.js',
  useFileHash: false,
  moduleSystem: 'commonjs',
};
