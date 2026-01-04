function print(...args){
    const shouldPrint = process.env.CONSOLE_OPEN === "true";
    if (shouldPrint) {
        console.log(...args);
    }

}


module.exports = {print}