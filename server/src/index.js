import express from 'express'
import dotenv from "dotenv"
import cors from "cors"
import connectDB from "./database/database.js"

dotenv.config({
    path: "./.env"
})

const app = express()

const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || []

// Middlewares
app.use(express.json())
app.use(cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl)
      console.log('Incoming request from origin:', origin)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('CORS not allowed for this origin'))
      }
    },
    credentials: true
  }));


// Routes Declaration
import jobRouter from './routes/job.route.js'
import metaRouter from './routes/meta.route.js'
import healthRouter from './routes/health.route.js'

app.use('/api/v1', healthRouter)
app.use('/api/v1/jobs', jobRouter)
app.use('/api/v1/meta', metaRouter)

app.get('/', (req, res) => {
    res.send('Hirebuddy up and running')
})

connectDB()
    .then(connectionInstance => {
        console.log(`MongoDB connected at host ${connectionInstance.connection.host}`)

        app.on("error", (error) => {
            console.log("Error: ", error)
            throw error

        })

        const PORT = process.env.PORT || 3000
        app.listen(PORT, () => {
            console.log(`Server is listening at port ${PORT}`)
        })
    })