const {Person} = require("../models")
const {DataClassFactory} = require("fast-express-backend");
const {DATABASE_TYPES, Databases} = require("fast-express-backend/databases");


function createPersonFactory(){
    return new DataClassFactory(Person,{'DATABASE':DATABASE_TYPES.POSTGRES})
}


const router = require("express").Router()
console.log(Databases.connections[DATABASE_TYPES.POSTGRES])
// const personFactory = new DataClassFactory(Person,{'DATABASE':DATABASE_TYPES.POSTGRES})


router.post("/", async (req, res) => {
    const personFactory  = createPersonFactory()
    try{
        const user = await personFactory.createObject(req.body)
        const response = await user.validate()
        if(response.data.okay){
            const updatedPerson = await personFactory.createModelObject(req.body)
            return res.status(201).send(updatedPerson);
        }else{
            return res.status(400).json(response)
        }
    }catch (error){
        console.error(error)
    }


})

router.post("/valid-user",async (req, res) => {
    const personFactory  = await createPersonFactory()
    const person = await personFactory.createObject(req.body)
    const response = await person.validate()
    return res.status(200).json(response)
})

router.put("/",async (req,res) => {
    const personFactory = createPersonFactory();
    const {query,payload} = req.body;
    const output = await personFactory.updateModelObject(query,payload)
    return res.status(204).json(output);
})


const USER_OTP_RECORDS = {}

router.post("/verify-user",async(req,res) => {
    const randomNumber = Math.round(Math.random() * Math.pow(10,6))

    console.log("Rrequest came here")
    const {contactNumber} = req.body;
    USER_OTP_RECORDS[contactNumber] = randomNumber.toString();
    console.log(USER_OTP_RECORDS , " This is records")
    return res.status(201).json({'sent':"Okay","production":{"otp":randomNumber.toString()}});
})

router.post("/check-user-verification",async(req,res) => {
    const {contactNumber,otp} = req.body;
    console.log(USER_OTP_RECORDS)
    const userCode = USER_OTP_RECORDS[contactNumber]
    if(userCode === otp){
        return res.status(200).json({"match":true})
    }else{
        return res.status(400).json({"match":false})
    }
})



module.exports = router;