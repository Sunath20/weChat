const {Databases, DATABASE_TYPES} = require("fast-express-backend/databases");

function getDB(){
    return Databases.connections[DATABASE_TYPES.POSTGRES]
}


function getFromTable(table,...fields){
    return fields.map((field)=> table+"."+field)
}

module.exports = {getDB,getFromTable}