const {Users} = require("./Users")
const {createRoomFactory, checkRoomExitsForTwoPersons} = require("../models/Room");
const {sendSocketData, MAIN_HANDLERS, MESSAGE_TYPES} = require("../utils");
const {Database} = require("fast-express-backend/databases/database");
const {Databases, DATABASE_TYPES} = require("fast-express-backend/databases");
const {PostgresqlQuery, ACTION_TYPES} = require("fast-express-backend/query/postgresqlQuery");
const {Room} = require("../models");
const {getDB} = require("../utils/database");
const {createMessageFactory} = require("../models/Message");


class MessageHandler {


    constructor(socketHandler) {
        this.socketHandler = socketHandler;
        this.handlers = {
            [MESSAGE_TYPES.SEND] : this.sendMessageToSomeOne.bind(this),
            [MESSAGE_TYPES.CREATE_ROOM]:this.createRoom.bind(this)
        }
    }

    async handle(payload){
        console.log(payload)
        const action = payload['handlerOne']
        this.handlers[action](payload);
    }


    async sendMessageToSomeOne(payload){
        const to = payload['to'];
        const peoples = [payload['from'],payload['to']].sort();
        const db = getDB()
        const room =  await db.find(Room,{personOne:peoples[0],personTwo: peoples[1]})
        const id = room._id

        const data  = {
            from:this.socketHandler.userID,
            to:to,
            message:payload.message,
            mainHandler:MAIN_HANDLERS.MESSAGE,
            handlerOne:MESSAGE_TYPES.MESSAGE_RECEIVED
        }

        const savedData = {
            content:payload.message,
            roomId:id,
            sentById:this.socketHandler.userID,
            contentType:"Message"
        }

        const messageFactory =  createMessageFactory();
        await messageFactory.createModelObject(savedData)

        sendSocketData(JSON.stringify(data),to);

    }


    async createRoom(payload){

        const {from,to} = payload;
        const roomFactory = createRoomFactory();
        const data = {personOne:from,personTwo:to}
        console.log(data, " This is the payload this what we use to create the room")
        const room = await roomFactory.createObject(data)
        const response = await room.validate();



        if(response.data.okay){
            const updatedRoom = await roomFactory.createModelObject(data)


            updatedRoom['mainHandler'] = MAIN_HANDLERS.MESSAGE;
            updatedRoom['handlerOne'] = MESSAGE_TYPES.ROOM_CREATED;

            const updatedRoomInfo = JSON.stringify(updatedRoom);

            sendSocketData(updatedRoomInfo,from,to);
        }else{
                const returnInfo = {'mainHandler':MAIN_HANDLERS.MESSAGE,'handlerOne':MESSAGE_TYPES.ROOM_CREATED_FAILED,response};
                sendSocketData(JSON.stringify(returnInfo),from)
        }
    }

}


module.exports = {MessageHandler}