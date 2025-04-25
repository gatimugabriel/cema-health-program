import express from "express";
import cors from "cors";
import morgan from "morgan"
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import "reflect-metadata";

import errorMiddleware from "./shared/errors/errors";

dotenv.config()
const app = express()

app.use(express.json({limit: '50mb'}))
app.use(express.urlencoded({limit: '50mb', extended: true}))
app.use(morgan('dev'))
app.use(cookieParser())

//___ CORS ___//
const allowedOrigins = [
    process.env["ADMIN_ORIGIN"]
].filter(Boolean) as string[]
const corsOptions: cors.CorsOptions = {
    origin: allowedOrigins,
    credentials: true,
    optionsSuccessStatus: 200,
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Length', 'X-JSON'],
}
app.use(cors(corsOptions))

//Global Error Middlewares
app.use(errorMiddleware.notFound)
app.use(errorMiddleware.handleErrors)

const PORT = parseInt(process.env["PORT"] as string) || 8080
const HOST = process.env["HOST"] || '0.0.0.0'

app.listen(PORT, HOST, () => {
    console.log(`Server is running on port: ${PORT}`)
})

process.on('SIGINT', () => {
    console.log('Server is shutting down...')
    process.exit(0)
})

