const {DataClass, DataClassFactory} = require("fast-express-backend");
const {types,createField} = require("fast-express-backend/databases/postgresql")
const {DATABASE_TYPES} = require("fast-express-backend/databases");
const {ERRORS} = require("../utils/indexes");
const {getDB} = require("../utils/database");

class Room extends DataClass {

    getName() {
        return "rooms"
    }

    personOne = createField(
        types.TEXT,
        false,
        true,
        []
    );

    personTwo = createField(
        types.TEXT,
        false,
        true,
        []
    );


    async validateAllData() {

        const {personOne, personTwo} = this['form_data'];
        const response = await checkRoomExitsForTwoPersons(personOne,personTwo);
       return new Promise((resolve,reject) => {
           if(response.length === 0){
            resolve({okay:true})
           }else{
               resolve({okay:false,error:"Room Is Already Exists;",errorCode:ERRORS.ROOM_ALREADY_EXISTS})
           }

       })


    }

}


function createRoomFactory(){
    return new DataClassFactory(Room,{'DATABASE':DATABASE_TYPES.POSTGRES})
}

function checkRoomExitsForTwoPersons(personOne, personTwo){
    const db = getDB();
    return db.find(Room,{personOne,personTwo},true,2)
}

module.exports = {Room,createRoomFactory,checkRoomExitsForTwoPersons};