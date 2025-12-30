// import {Person} from "./Person"
// import {Room} from "./Room"
// import {Message} from "./Message"

const {Person} = require('./Person');
const {Room} = require('./Room');
const {Message} = require('./Message');
const PostgresDatabase =  require("fast-express-backend/databases/postgresql")


/**
 *
 * @param db {PostgresDatabase} - Postgresql database connection
 */
async function registerAllTables(db){
    await db.createTable(Person);
    console.log("Person table was created")
    await db.createTable(Room);
    console.log("Room table was created")
    await db.createTable(Message);
    console.log("Message table was created")
}

module.exports = {Person,Room,Message,registerAllTables:registerAllTables}