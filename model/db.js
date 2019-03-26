const Sequelize = require('sequelize');
const dbConfig = require('../config/dbConfig')

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    operatorsAliases: false,
    // 设置时区
    timezone: '+08:00',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    
    // define: {
    // 全局设置引擎, 默认是 InnoDB
    //     engine: 'MYISAM', 
    // SQLite only
    // storage: 'path/to/database.sqlite'
});

module.exports = sequelize;