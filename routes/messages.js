const {getDB, getFromTable} = require("../utils/database");
const {Room, Message} = require("../models");
const {PostgresqlQuery, ACTION_TYPES, ORDER_DIRECTIONS} = require("fast-express-backend/query/postgresqlQuery");
const {MessageMetaData} = require("../models/Message");
const router = require('express').Router();


const commonFieldsToRetrieve = ['_id','content','sentbyid','createdat','userReceivedAt','contentType','roomId']

// Get the latest {{limit}} amount of messages
router.get("/get-messages", async(req, res) => {

    const personOne = req.query.personOne;
    const personTwo = req.query.personTwo;

    const {limit,skip} = req.query

    const db = getDB();


    const query = new PostgresqlQuery(Room);
    query.setActionType(ACTION_TYPES.SELECT);

    query.setSelectingFields(
        [
            ...getFromTable('messages',...commonFieldsToRetrieve)
        ]
    )



    query.setTableName(Message);
    query.innerJoin('rooms','rooms._id','messages.roomId');
    query.startFiltering().equals('rooms.personOne',personOne);
    query.equals('rooms.personTwo',personTwo);
    query.endFiltering();


    query.limit(limit);
    query.skip(skip);

    query.orderBy('createdat','DESC');


    const response = query.build()
    const messages = await db.runQuery(response.query,response.values)
    return res.status(200).json(messages.reverse())

})

router.post("/message-delivered",async (req,res) => {
    const data = req.body;

    const db = getDB()
    await db.update(Message,data.query,data.payload)
    return res.status(200).json({'updated':true})
})

router.post("/message-read",async (req,res) => {
    const data = req.body;
    const db = getDB()
    await db.update(MessageMetaData,data.query,data.payload);
    return res.status(200).json({'updated':true})
})


// Load the messages before the certain period of time
router.get("/load-messages",async (req,res) => {

    const personOne = req.query.personOne;
    const personTwo = req.query.personTwo;
    const lastTime =  req.query.lastTime

    const {limit,skip} = req.query

    const db = getDB();


    const query = new PostgresqlQuery(Room);
    query.setActionType(ACTION_TYPES.SELECT);

    query.setSelectingFields(
        [
            ...getFromTable('messages',...commonFieldsToRetrieve)
        ]
    )



    query.setTableName(Message);
    query.innerJoin('rooms','rooms._id','messages.roomId');

    query.startFiltering().equals('rooms.personOne',personOne);
    query.equals('rooms.personTwo',personTwo);

    query.lessThan('messages.createdat',lastTime);

    query.endFiltering();


    query.limit(limit);
    query.skip(skip);

    query.orderBy('createdat',ORDER_DIRECTIONS.Descending);


    const response = query.build()

    const messages = await db.runQuery(response.query,response.values)
    return res.status(200).json(messages.reverse())

})


// Load the messages after a certain period of time
router.get('/load-new-messages',async (req,res) => {
    const {personOne,personTwo,messageID} = req.query;




    const db = getDB()

    const details = await  db.find(Message,{_id:messageID})
    const query = new PostgresqlQuery(Room);
    query.setActionType(ACTION_TYPES.SELECT);

    query.setSelectingFields(
        [
            ...getFromTable('messages',...commonFieldsToRetrieve)
        ]
    )



    query.setTableName(Message);
    query.innerJoin('rooms','rooms._id','messages.roomId');

    query.startFiltering().equals('rooms.personOne',personOne);
    query.equals('rooms.personTwo',personTwo);

    query.graterThan('messages.createdat',details['createdat']);

    query.endFiltering();


    query.orderBy('createdat',ORDER_DIRECTIONS.Descending);


    const response = query.build()

    const messages = await db.runQuery(response.query,response.values)
    messages.pop()
    return res.status(200).json(messages.reverse())



})


// Returns the metadata including times like received and read
router.post("/get-message-deliver-times",async (req,res) => {
    const {messageIDList} = req.body;
    const db = getDB()

    const responseList = []

    for(let i = 0 ; i < messageIDList.length ; i++){

        const ID = messageIDList[i]
        const obj = await db.find(Message,{_id:ID})
        responseList.push({messageID:ID,userReceivedAt:obj['userreceivedat'],userRead:obj['userread'],userReadMessageAt:obj['userreadmessageat']})
    }

    return res.status(200).json(responseList)


})


module.exports = router;