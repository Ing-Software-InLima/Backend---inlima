import Sequelize from 'sequelize'

//const hostname = 'inlima-db.postgres.database.azure.com'
const hostname = 'inlima--db.postgres.database.azure.com'
const username = 'postgre'
const password = 'Password1234'//56
const database = 'inlima'
const dbPort = 5432
const dialect = 'postgres'

const sequelize = new Sequelize(database, username, password, {
    host: hostname,
    port: dbPort,
    dialect: dialect,
    operatorAliases: false,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },
    pool: {
        max: 100,
        min:0,
        acquire: 20000,
        idle: 5000
    },
    define: {
        freezeTableName: true,
        timestamps: false
    }
})

export default sequelize;