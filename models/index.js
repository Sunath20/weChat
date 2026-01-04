// import {Person} from "./Person"
// import {Room} from "./Room"
// import {Message} from "./Message"

const {Person} = require('./Person');
const {Room} = require('./Room');
const {Message, MessageMetaData} = require('./Message');
const PostgresDatabase =  require("fast-express-backend/databases/postgresql")
const {print} = require("../utils");


/**
 *
 * @param db {PostgresDatabase} - Postgresql database connection
 */
async function registerAllTables(db){
    await db.createTable(Person);
    print("Person Table created")
    await db.createTable(Room);
    print("Room Table Created")
    await db.createTable(Message);
    print("Message table was created")
    await db.createTable(MessageMetaData)
    print("Message meta table was created")
}

module.exports = {Person,Room,Message,registerAllTables:registerAllTables}