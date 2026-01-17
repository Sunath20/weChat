const {Users} = require("../handleChats/Users");

/**
 * Sends the same data to the given socket id's
 * @param data {String} - Data in a string format
 * @param args  {String[]} -
 */
function sendSocketData(data,...args){

        const isBinary = data instanceof Buffer;
        for(let i= 0; i < args.length;i++){
            if(Users.users[args[i]]){
                Users.users[args[i]].socket.send(data,{isBinary});
            }

        }
}


module.exports = {sendSocketData}