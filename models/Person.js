const {DataClass, DataClassFactory} = require("fast-express-backend");
const {types,createField} = require("fast-express-backend/databases/postgresql")
const {DATABASE_TYPES} = require("fast-express-backend/databases");


function createPersonDataClasFactory(){
    return new DataClassFactory(Person,{'DATABASE':DATABASE_TYPES.POSTGRES})
}

class Person extends DataClass{


    getName() {
        return "peoples"
    }

    firstName = createField(
        types.TEXT,
        false,
        true,
        [],
    );

    lastName = createField(
        types.TEXT,
        false,
        true,
        []
    );

    contactNumber = createField(
        types.TEXT,
        true,
        true,
        []
    );

    birthday = createField(
        types.DATE,
        false,
        true,
        []
    );

    countryCode = createField(
        types.TEXT,
        false,
        true,
        []
    );

    email = createField(
        types.TEXT,
        true,
        true,
        []
    );
}

module.exports = {Person,createPersonDataClasFactory}