
module.exports = {
    development: {
        username: "root",
        password: "",
        database: "qclose_inventory",
        host: "localhost",
        port: "3306",
        dialect: "mysql",
        migrationStorageTableName: "_migration_",
        dialectOptions: {
            bigNumberStrings: true
        }
    },
    production: {
        username: process.env.MYSQL_USERNAME,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        host: process.env.MYSQL_HOST,
        port: process.env.MYSQL_PORT,
        dialect: "mysql",
        migrationStorageTableName: "_migration_",
        dialectOptions: {
            bigNumberStrings: true
        }
    }
};
