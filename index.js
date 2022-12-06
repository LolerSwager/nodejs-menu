import express from "express"
import schedule from "node-schedule"
import fetch from "node-fetch"
import fs from "fs"
import userCheacker from "./components/userCheacker.js"
import timeDate from "./components/cal.js"
const port = 8080

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

app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader("Access-Control-Allow-Origin", "*")

    // Request methods you wish to allow
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE")

    // Request headers you wish to allow
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, Accept, Accept-Language, X-Authorization, X-Requested-With,content-type"
    )

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader("Access-Control-Allow-Credentials", true)

    next()
})

app.get("/api", (req, res) => {
    const { apiKey } = req.query

    if (!apiKey) {
        res.sendStatus(400)
    }

    if (apiKey !== keys) {
        res.send({ data: "API Key not valid" })
    }

    let rawdata = fs.readFileSync("./json/kantine.json")
    let student = JSON.parse(rawdata)

    res.send(student)
    userCheacker(req)
})

app.get("/info", (req, res) => {
    const ipAddress = req.headers["x-forwarded-for"] || req.connection.remoteAddress
    userCheacker(req)
    res.send(`[${timeDate()}] Your ip address: ${ipAddress}`)
})

app.listen(process.env.PORT || port, () => console.log(`port is on ${port}`))
