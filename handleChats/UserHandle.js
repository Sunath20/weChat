const {SocketHandler} = require("./index");
const {Users} = require("./Users");
const {USER_HANDLES} = require("../utils/indexes");



class UserHandler {

    /**
     *
     * @param socketHandler {SocketHandler}
     */
    constructor(socketHandler) {
        this.socketHandler = socketHandler;
    }

    handle(payload){

        if(payload['handlerOne'] === USER_HANDLES.NEW_CONNECTION){
            const id = payload['userID']
            // console.log(SocketHandler.USERS)
            Users.users[id] = this.socketHandler
            this.userID = id;
            this.socketHandler.setUserID(this.userID)
            console.log("User logged " + id)
        }

        if(payload['handlerOne'] === USER_HANDLES.REMOVE_CONNECTION){
            delete SocketHandler.USERS[payload['userID']]
        }

    }


}


module.exports = {UserHandler}