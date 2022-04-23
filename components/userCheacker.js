import fetch from "node-fetch";
import timeDate from "./cal.js";
import FreeGeoIp from "../config/config.js";

export default function userCheacker(){
    
    const apikey = FreeGeoIp();

    const url = `https://api.freegeoip.app/json/?apikey=${apikey}`;
    
    fetch(url)
        .then(res => res.json())
        .then((out) => {
            return console.log(`\x1b[35m [${timeDate()}] [USEDBY | ${out.ip}] - userCheacker \x1b[0m`);
        })
        .catch(err => {return console.log(`\x1b[31m [${new Date().toLocaleString()}] [ERROR] [${err}] - userCheacker  \x1b[0m`) });
}