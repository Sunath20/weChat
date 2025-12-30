const {DataClass, DataClassFactory} = require("fast-express-backend");
const {types,createField} = require("fast-express-backend/databases/postgresql");
const {DATABASE_TYPES} = require("fast-express-backend/databases");

class Message extends DataClass{

    getName() {
        return "messages";
    }

    content = createField(
        types.TEXT,
        false,
        true,
        []
    );

    roomId = createField(
        types.TEXT,
        false,
        true,
        []
    );

    sentById = createField(
        types.TEXT,
        false,
        true,
        []
    );

    contentType = createField(
        types.TEXT,
        false,
        true,
        []
    );
}

function createMessageFactory(){
    return new DataClassFactory(Message,{'DATABASE':DATABASE_TYPES.POSTGRES})
}

module.exports = {Message,createMessageFactory}