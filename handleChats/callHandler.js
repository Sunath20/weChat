const {MAIN_HANDLERS, sendSocketData} = require("../utils");
const {CALL_TYPES} = require("../utils/indexes");

class CallHandler {

    /**
     *
     * @param {string} userID - id of the current web socket user
     */
    constructor(userID) {
        this.currentUser = userID;

        this.handlers = {
            [CALL_TYPES.CALL_OFFER_CREATED]:this.openCall.bind(this),
            [CALL_TYPES.CALL_ANSWER_CREATED]:this.answeredCall.bind(this),
            [CALL_TYPES.CALL_ICE_NEW_CANDIDATE_CREATED]:this.newIceCandidate.bind(this),
            [CALL_TYPES.CALL_WAS_DISCONNECTED_BY_USER]:this.onCallUserDisconnect.bind(this)
        }
    }

    openCall(payload){
        const {to,offer,from,onlyAudio} = payload;
        const userPayload = {
            mainHandler:MAIN_HANDLERS.CALL,
            handlerOne:CALL_TYPES.CALL_OFFER_RECEIVED,
            offer,
            from,
            onlyAudio
        }
        console.log("Opened the call sending the data to the other user ",payload,to)
        sendSocketData(JSON.stringify(userPayload),to);
    }


    answeredCall(payload){
        const {to,answer} = payload;
        const userPayload = {
            mainHandler:MAIN_HANDLERS.CALL,
            handlerOne:CALL_TYPES.CALL_ANSWER_RECEIVED,
            answer:answer,
        }
        sendSocketData(JSON.stringify(userPayload),to);
    }

    newIceCandidate(payload){
        const {candidate,to} = payload;

        const userPayload = {
            mainHandler:MAIN_HANDLERS.CALL,
            handlerOne:CALL_TYPES.CALL_ICE_NEW_CANDIDATE_RECEIVED,
            candidate
        }

        sendSocketData(JSON.stringify(userPayload),to);
    }

    onCallUserDisconnect(payload){
        const {to} = payload;
        const userPayload = {
            mainHandler:MAIN_HANDLERS.CALL,
            handlerOne:CALL_TYPES.CALL_WAS_DISCONNECTED_BY_USER_RECEIVED,
        }

        sendSocketData(JSON.stringify(userPayload),to);
    }

    handle(payload){
        const handlerOne = payload['handlerOne']
        if(handlerOne && this.handlers[handlerOne]){
            this.handlers[handlerOne](payload);
        }
    }



}



module.exports = {CallHandler}