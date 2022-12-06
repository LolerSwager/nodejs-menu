import express from "express"
import schedule from "node-schedule"
import fetch from "node-fetch"
import fs from "fs"
import userCheacker from "./components/userCheacker.js"
import timeDate from "./components/cal.js"
const port = 8080

import cors from "cors"


const app = express()

const keys = "techcollege"

console.log(`\x1b[32m [${timeDate()}] [STARTING] - kantine menu  \x1b[0m`)

let j = schedule.scheduleJob("00 00/30 * * * *", function () {
    // this for one hour
    const url = "https://infoskaerm.techcollege.dk/umbraco/api/content/getcanteenmenu/?type=json"

    fetch(url)
        .then((res) => res.json())
        .then((out) => {
            // console.info('Checkout this JSON! ', out);

            let file_path = "./json/"
            let file_name = "kantine.json"

            fs.writeFileSync(file_path + file_name, JSON.stringify(out))
            console.log(`\x1b[36m [${timeDate()}] [UPDATING] - kantine menu  \x1b[0m`)
        })
        .catch((err) => {
            console.log(`\x1b[31m [${new Date().toLocaleString()}] [ERROR] [${err}]- kantine menu  \x1b[0m`)
        })
})

app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "OPTIONS", "PUT", "PATCH", "DELETE"],
        allowedHeaders: [
            "Content-Type",
            "Authorization",
            "Accept",
            "Accept-Language",
            "X-Authorization",
            "X-Requested-With",
            "content-type",
        ],
        credentials: true,
    })
)

app.get("/info", (req, res) => {
    const ipAddress = req.headers["x-forwarded-for"] || req.connection.remoteAddress
    userCheacker(req)
    res.send(
        `<ul>
            <li>Time: ${timeDate()}</li>
            <li>Your ip: ${ipAddress}</li>
            <li>Api will run every 30min</li>
            <li>Api link: <a href="https://nodejs-menu.vercel.app/api?apiKey=techcollege">https://nodejs-menu.vercel.app/api?apiKey=techcollege</a></li>
        </ul>`
    )
})

app.listen(process.env.PORT || port, () => console.log(`port is on ${port}`))
