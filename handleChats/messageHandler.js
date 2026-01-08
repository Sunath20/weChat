const {Users} = require("./Users")
const {createRoomFactory, checkRoomExitsForTwoPersons} = require("../models/Room");
const {sendSocketData, MAIN_HANDLERS, MESSAGE_TYPES, print} = require("../utils");
const {Database} = require("fast-express-backend/databases/database");
const {Databases, DATABASE_TYPES} = require("fast-express-backend/databases");
const {PostgresqlQuery, ACTION_TYPES} = require("fast-express-backend/query/postgresqlQuery");
const {Room} = require("../models");
const {getDB} = require("../utils/database");
const {createMessageFactory, createMessageMetaDataFactory, Message} = require("../models/Message");


class MessageHandler {


    constructor(socketHandler) {
        this.socketHandler = socketHandler;
        this.handlers = {
            [MESSAGE_TYPES.SEND] : this.sendMessageToSomeOne.bind(this),
            [MESSAGE_TYPES.CREATE_ROOM]:this.createRoom.bind(this),
            [MESSAGE_TYPES.SET_MESSAGE_DELIVERED]:this.setMessageDelivered.bind(this),
            [MESSAGE_TYPES.SET_LIST_OF_MESSAGE_DELIVERED]:this.setListOfMessageDelivered.bind(this),
            [MESSAGE_TYPES.SET_SEEN_MESSAGE]:this.setSeenMessage.bind(this)
        }
    }

    async handle(payload){
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
            content:payload.message,
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
        const obj = (await messageFactory.createModelObject(savedData))[0]

        const allData = {...data,...obj,friend:to}

        sendSocketData(JSON.stringify(allData),to);
        allData['handlerOne'] = MESSAGE_TYPES.GET_BACK_CREATED_MESSAGE
        sendSocketData(JSON.stringify(allData),this.socketHandler.userID);

    }


    async createRoom(payload){

        const {from,to} = payload;
        const roomFactory = createRoomFactory();
        const data = {personOne:from,personTwo:to}
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

    async setMessageDelivered(payload){
        const {messageID,time,to} = payload;


        const db = getDB()

        await db.update(Message,{_id:messageID},{userReceivedAt:time})
        sendSocketData(JSON.stringify({
            mainHandler:MAIN_HANDLERS.MESSAGE,
            handlerOne:MESSAGE_TYPES.MESSAGE_DELIVERED,
            changes:{userReceivedAt:time},
            messageID:messageID,
            from:this.socketHandler.userID
        }),to)
    }



    async setListOfMessageDelivered(payload){
        const {to,messageIDList,deliveredTime} = payload;
        const db = getDB()

        for(let i = 0 ; i < messageIDList.length;i++){
            const messageID = messageIDList[i]
            await db.update(Message,{_id:messageID},{userReceivedAt:deliveredTime})
        }

        const userPayload = {
            mainHandler:MAIN_HANDLERS.MESSAGE,
            handlerOne:MESSAGE_TYPES.RECEIVE_LIST_OF_MESSAGE_DELIVERED,
            messageIDList,
            deliveredTime,
            from:this.socketHandler.userID
        }

        sendSocketData(JSON.stringify(userPayload),to)
    }


    async setSeenMessage(payload){
        const {to,messageID,seenTime} = payload
        const db = getDB()
        await db.update(Message,{_id:messageID},{userReadMessageAt:seenTime,userRead:true})
        const userPayload = {
            mainHandler:MAIN_HANDLERS.MESSAGE,
            handlerOne:MESSAGE_TYPES.RECEIVE_SEEN_MESSAGE,
            messageID,
            from:this.socketHandler.userID,
            changes:{userReadMessageAt:seenTime,userRead:true},
        }
        sendSocketData(JSON.stringify(userPayload),to)
    }
}


module.exports = {MessageHandler}