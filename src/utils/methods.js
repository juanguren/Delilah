
const moment = require("moment");

export const orderTime = () =>{
    return new Date();
}

export const generateArrivalTime = () =>{
    return moment(new Date()).add(35, "minutes");
}