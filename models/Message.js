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

    userRead = createField(
        types.BOOLEAN,
        false,
        false,
        []
    )

    userReceivedAt = createField(
        types.DATETIME,
        false,
        false,
        []
    )

    userReadMessageAt = createField(
        types.DATETIME,
        false,
        false,
        []
    )

}



class MessageMetaData extends DataClass {


    getName() {
        return "message_meta";
    }

    messageId = createField(
        types.TEXT,
        true,
        true,
    )

    read = createField(
        types.BOOLEAN,
        false,
        false
    )


    receivedAt = createField(
        types.DATETIME,
        false,
        false
    )

    readAt = createField(
        types.DATETIME,
        false,
        false
    )
}

function createMessageFactory(){
    return new DataClassFactory(Message,{'DATABASE':DATABASE_TYPES.POSTGRES})
}

function createMessageMetaDataFactory(){
    return new DataClassFactory(MessageMetaData,{'DATABASE':DATABASE_TYPES.POSTGRES})
}

module.exports = {Message,createMessageFactory,createMessageMetaDataFactory,MessageMetaData}