import timeDate from "./cal.js"

export default function userCheacker(req) {
    // Use destructuring assignment to get the 'x-forwarded-for' and 'remoteAddress' values from the request object.
    const {
        headers: { "x-forwarded-for": forwardedFor },
        connection: { remoteAddress },
    } = req

    // Use the 'forwardedFor' value if it exists, otherwise use the 'remoteAddress' value.
    const idAddress = forwardedFor || remoteAddress

    // Use template literals and string interpolation to build the log message.
    console.log(`[${timeDate()}] [USEDBY | ${idAddress}] - userCheacker`)
}
