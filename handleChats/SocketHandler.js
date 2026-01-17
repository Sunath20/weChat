const {UserHandler} = require("./UserHandle");
const {Users} = require("./Users");
const {MessageHandler} = require("./messageHandler");
const {MAIN_HANDLERS, sendSocketData} = require("../utils");
const {FileHandler} = require("./fileHandler");
const buffer = require("node:buffer");
const {CallHandler} = require("./callHandler");


class SocketHandler {



    /**
     *
     * @param socket {WebSocket}
     */
    constructor(socket) {
        this.socket = socket;
        this.socket.onmessage = this.onMessage.bind(this);
        this.socket.onclose = this.closeConnection.bind(this);

        this.userHandler = new UserHandler(this);
        this.messageHandler = new MessageHandler(this);
        this.fileHandler = new FileHandler(this);
        this.callHandler = new CallHandler()

        this.handlers = {
            [MAIN_HANDLERS.USER_CONFIG]:this.userHandler,
            [MAIN_HANDLERS.MESSAGE]:this.messageHandler,
            [MAIN_HANDLERS.FILE_SHARE]:this.fileHandler,
            [MAIN_HANDLERS.CALL]:this.callHandler
        }
    }




    onMessage(msg) {

            const payload = JSON.parse(msg.data.toString());
            const handlerType = payload['mainHandler'];
            this.handlers[handlerType].handle(payload)
    }


    newConnection(payload) {
        SocketHandler.USERS[payload['username']] = this.socket;
        this.USER_KEY = payload['username'];
    }

    setUserID(userID) {
        this.userID = userID;
    }

    removeConnection(payload) {
        console.log("User log out "+ this.userHandler.userID)
        delete Users.users[this.userHandler.userID];
    }

    createRoom(payload){}
    createMessage(payload){}


    closeConnection(payload){
        this.removeConnection(payload);
    }



}

module.exports = {SocketHandler};