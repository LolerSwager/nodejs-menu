import express from 'express';
import schedule from 'node-schedule';
import fetch from "node-fetch";
import fs from "fs";
import userCheacker from './components/userCheacker.js';
import timeDate from "./components/cal.js";
const port = 8080;

const app = express();

const keys = "techcollege"

console.log(`\x1b[32m [${timeDate()}] [STARTING] - kantine menu  \x1b[0m`);

let j = schedule.scheduleJob('00 00/30 * * * *', function(){  // this for one hour
    const url = "https://infoskaerm.techcollege.dk/umbraco/api/content/getcanteenmenu/?type=json";

    fetch(url)
    .then(res => res.json())
    .then((out) => {
        // console.info('Checkout this JSON! ', out);

        let file_path = "./json/";
        let file_name = "kantine.json";

        fs.writeFileSync(file_path + file_name, JSON.stringify(out));
        console.log(`\x1b[36m [${timeDate()}] [UPDATING] - kantine menu  \x1b[0m`);

    })
    .catch(err => {console.log(`\x1b[31m [${new Date().toLocaleString()}] [ERROR] [${err}]- kantine menu  \x1b[0m`) });

});

app.get('/api', (req, res) => {
    res.setHeader('Acces-Control-Allow-Origin','*');
    res.setHeader('Acces-Control-Allow-Methods','GET');
    res.setHeader('Acces-Contorl-Allow-Methods','Content-Type','Authorization');

    const {apiKey} = req.query;

    if(!apiKey){
        res.sendStatus(400);
    }
    
    if(apiKey !== keys){
        res.send({data: 'API Key not valid' });
    }

    
    
    let rawdata = fs.readFileSync('./json/kantine.json');
    let student = JSON.parse(rawdata);


    res.send(student);
    userCheacker(req)

});

app.listen(process.env.PORT || port,() => console.log(`port is on ${port}`));