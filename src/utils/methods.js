
const moment = require("moment");

const orderTime = () =>{
    return new Date();
}

const generateArrivalTime = () =>{
    return moment(new Date()).add(35, "minutes").toDate();
}

module.exports = { orderTime, generateArrivalTime };
