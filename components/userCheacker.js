import fetch from "node-fetch";
import timeDate from "./cal.js";
import requestIp from 'request-ip';

export default function userCheacker(req){
    const idAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    return(
        console.log(`\x1b[35m [${timeDate()}] [USEDBY | ${idAddress}] - userCheacker  \x1b[0m`)
    );
}