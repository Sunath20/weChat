const {getDB, getFromTable} = require("../utils/database");
const {Room, Message} = require("../models");
const {PostgresqlQuery, ACTION_TYPES, ORDER_DIRECTIONS} = require("fast-express-backend/query/postgresqlQuery");
const router = require('express').Router();







router.get("/get-messages", async(req, res) => {

    const personOne = req.query.personOne;
    const personTwo = req.query.personTwo;

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




    const response = query.build()
    const messages = await db.runQuery(response.query,response.values)

    return res.status(200).json(messages)

})


module.exports = router;