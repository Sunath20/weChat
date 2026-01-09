const {FILE_TYPES} =  require("../utils/indexes");
const {getDB} = require("../utils/database");
const {Room} = require("../models");
const {MAIN_HANDLERS, sendSocketData} = require("../utils");
const {createMessageFactory} = require("../models/Message")

const fs = require("fs")
const fileSystem = require("node:fs/promises")


class FileHandler {
    /**
     *
     * @param {SocketHandler} socket
     */
    constructor(socket) {
        this.handlers = {
            [FILE_TYPES.FILE_CREATE]:this.createFileMessage,
            [FILE_TYPES.FILE_CHUCK_TO_SERVER]:this.addChuckToFile,
            [FILE_TYPES.FILE_CHUCK_FINISHED]:this.finishFile
        }
    }

    handle(payload){
        const handlerOne  = payload['handlerOne']
        if(this.handlers[handlerOne]){
            this.handlers[handlerOne](payload)
        }
    }



    async createFileMessage(payload){

        // TODO
        // 1. Find the Room & Create the message
        // 2. Create the File Instance
        // 3. Send back the data to the uploader in order send back and fourth data

        const {fileName,personOne,personTwo,from} = payload;

        const [p1,p2] = [personOne,personTwo].sort();

        const db = getDB();
        const room = await db.find(Room,{personOne:p1,personTwo:p2})
        if(room){
            const roomId = room['_id']
            const time = (new Date()).getMilliseconds();
            const localPath = `./media/${roomId}/`
            const localFilePath = localPath + time+ "-" + fileName


            const userPayload = {
                mainHandler:MAIN_HANDLERS.FILE_SHARE,
                handlerOne:FILE_TYPES.FILE_CREATED,
                fileName
            }

            const messageData = {
                content:localPath,
                roomId,
                sentById: from,
                contentType:"FILE"
            }

            const messageFactory = createMessageFactory()
            const messageObject = await messageFactory.createModelObject(messageData)


            userPayload['messageID'] = messageObject['_id']

            await fileSystem.mkdir(localPath,{recursive:true})
            await fileSystem.writeFile(localFilePath,[])

            sendSocketData(JSON.stringify(userPayload),from)
        }

    }

    addChuckToFile(payload){}

    finishFile(payload){}
}


module.exports = {FileHandler}