const {Databases, DATABASE_TYPES} = require("fast-express-backend/databases");
const {PostgresDatabase} = require("fast-express-backend/databases/postgresql")

/**
 * Returns the database instance we have created
 * @returns {PostgresDatabase}
 */
function getDB(){
    return Databases.connections[DATABASE_TYPES.POSTGRES]
}


function getFromTable(table,...fields){
    return fields.map((field)=> table+"."+field)
}

module.exports = {getDB,getFromTable}