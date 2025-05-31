import { createClient } from 'redis'
import dotenv from "dotenv"

dotenv.config()

const isLocal = process.env.REDIS_URL.includes("localhost")

const redisClient = createClient({
    url: process.env.REDIS_URL,
    ...(isLocal ? {} : {
        socket: {
          tls: true,
          rejectUnauthorized: false,
        }
      })
  })

redisClient.on('error', (err) => console.error('Redis Client Error', err));

await redisClient.connect()
.then(() => {
    console.log("Redis Connected")
})
.catch((err) => {
    console.error("Redis Error: ", err)
})

export default redisClient;