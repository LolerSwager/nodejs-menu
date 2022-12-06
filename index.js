import express from "express"
import schedule from "node-schedule"
import fetch from "node-fetch"
import fs from "fs"
import userCheacker from "./components/userCheacker.js"
import timeDate from "./components/cal.js"
import cors from "cors"

const port = 8080

const keys = "techcollege"

const app = express()

console.log(`\x1b[32m [${timeDate()}] [STARTING] - kantine menu  \x1b[0m`)

const j = schedule.scheduleJob("*/15 * * * * *", () => {
    const url = "https://infoskaerm.techcollege.dk/umbraco/api/content/getcanteenmenu/?type=json"
    fetch(url)
        .then(async (res) => {
            // Check the HTTP status code of the response
            if (!res.ok) {
                // If the status code is not in the 2xx range, throw an error
                throw new Error(`Received ${res.status} status code`)
            }

            // Parse the response as JSON
            const out = await res.json()

            // Store the file path and name in variables
            const file_path = "./json/"
            const file_name = "kantine.json"

            // Use fs.promises to write the file asynchronously
            // This will prevent the Node.js event loop from blocking
            // while the file is being written
            await fs.promises.writeFile(file_path + file_name, JSON.stringify(out))
            console.log(`\x1b[36m [${timeDate()}] [UPDATING] - kantine menu  \x1b[0m`)
        })
        .catch((err) => {
            console.log(`\x1b[31m [${timeDate()}] [ERROR] [${err}]- kantine menu  \x1b[0m`)
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

app.get("/api", (req, res) => {
    const { apiKey } = req.query

    // check if the query parameter "apiKey" is missing
    if (!apiKey) {
        return res.status(400).send({ error: "Missing 'apiKey' query parameter" })
    }

    // check if the provided API key is valid
    if (apiKey !== keys) {
        return res.status(401).send({ error: "Invalid API key" })
    }

    // read and parse the JSON data
    let rawdata = fs.readFileSync("./json/kantine.json")
    let student = JSON.parse(rawdata)

    // return the parsed data in the response
    res.send({ data: student })

    userCheacker(req)
})

app.get("/info", (req, res) => {
    // Use destructuring assignment to get the 'x-forwarded-for' and 'remoteAddress' values from the request object.
    const {
        headers: { "x-forwarded-for": forwardedFor },
        connection: { remoteAddress },
    } = req

    // Use the 'forwardedFor' value if it exists, otherwise use the 'remoteAddress' value.
    const idAddress = forwardedFor || remoteAddress

    // Create an object to hold the data
    const data = {
        time: timeDate(),
        ip: idAddress,
        apiInfo: "Api will run every 30min",
        apiLink: "https://nodejs-menu.vercel.app/api?apiKey=techcollege",
    }

    // Set the response's Content-Type header to application/json
    // and send the data as the response
    res.setHeader("Content-Type", "application/json")
    res.send(JSON.stringify(data))
})

app.listen(process.env.PORT || port, () => console.log(`port is on ${port}`))