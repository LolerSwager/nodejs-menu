import fetch from "node-fetch";
import timeDate from "./cal.js";
import requestIp from 'request-ip';

export default function userCheacker(res){
    const idAddress = res.connection.remoteAddress;
    return(
        console.log(`\x1b[35m [${timeDate()}] [USEDBY | ${idAddress}] - userCheacker  \x1b[0m`)
    );
}