const {getDB, getFromTable} = require("../utils/database");
const {Room, Message} = require("../models");
const {PostgresqlQuery, ACTION_TYPES, ORDER_DIRECTIONS} = require("fast-express-backend/query/postgresqlQuery");
const {MessageMetaData} = require("../models/Message");
const router = require('express').Router();







router.get("/get-messages", async(req, res) => {

    const personOne = req.query.personOne;
    const personTwo = req.query.personTwo;

    const {limit,skip} = req.query

    const db = getDB();


    const query = new PostgresqlQuery(Room);
    query.setActionType(ACTION_TYPES.SELECT);

    query.setSelectingFields(
        [
            ...getFromTable('messages','content','sentbyid','createdat')
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
    await db.update(MessageMetaData,data.query,data.payload)
    return res.status(200).json({'updated':true})
})

router.post("/message-read",async (req,res) => {
    const data = req.body;
    const db = getDB()
    await db.update(MessageMetaData,data.query,data.payload);
    return res.status(200).json({'updated':true})
})


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
            ...getFromTable('messages','content','sentbyid','createdat')
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
    console.log(response.query)
    const messages = await db.runQuery(response.query,response.values)
    return res.status(200).json(messages.reverse())

})

module.exports = router;