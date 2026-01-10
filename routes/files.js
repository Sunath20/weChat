const express = require('express')
const {createRoomFactory} = require("../models/Room");
const {getDB} = require("../utils/database");
const {Room} = require("../models");

const bodyParser = require("body-parser");

const router = express.Router();
const fs = require("node:fs/promises");
const normalFs = require("fs")
const {createMessageFactory} = require("../models/Message");


router.get("/startFileUpload",async (req,res) => {
    const {personOne,sentByID,personTwo,fileName,mimeType} = req.query;

    const db = getDB()
    const room = await db.find(Room,{personTwo,personOne})
    if(room){
        const roomId = room['_id']
        const filePath  = `./media/${roomId}`
        const messageFactory = createMessageFactory();
        const messagePayload = {
            sentById:sentByID,
            content:JSON.stringify({roomId,fileName,mimeType}),
            roomId,
            contentType:"File"
        }
        const msgOBJ = (await messageFactory.createModelObject(messagePayload))[0]
        console.log(msgOBJ)
        const savingFileName  = msgOBJ['_id'] + "-" + fileName
        await fs.mkdir(filePath, { recursive: true })
        await fs.writeFile(filePath+"/"+savingFileName,[])

        return res.status(200).json({fileName:savingFileName,filePath:filePath+"/"+savingFileName,message:msgOBJ})

    }
})

router.post("/updateFile/media/:roomId/:filename",bodyParser.raw({ type: "application/octet-stream", limit: "2mb" }),async (req,res) => {
    const {filename,roomId} = req.params
    const data = req.body;
    const path = "./media/"+roomId+"/"+filename
    await fs.appendFile(path,data)
    console.log("Writing Chuck Number ",req.headers['x-chunk-index'])
    res.sendStatus(200)

})


const BUFFER_SIZE = 1024*1024;
router.get("/readFile/:roomId/:filename",async (req,res) => {
    const {filename,roomId} = req.params

    const chunkIndex = req.headers['x-chunk-index'];
    const filePath = "./media/"+roomId+"/"+filename
    const file = normalFs.createReadStream(filePath,{highWaterMark:64*1024})
    res.setHeader('Content-Type', 'application/octet-stream');

    file.pipe(res);
})

module.exports = router;