import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import mongoose from "mongoose"
import authRoutes from "./routes/AuthRoutes.js"
import contactRoute from "./routes/ContactRoutes.js"
import errorHandler from "./middleware/error.js"

dotenv.config()

const app = express()
const port = process.env.PORT
const databaseURL = process.env.DATABASE_URL

app.use(cors({
    origin: [process.env.ORIGIN],
    methods: ["GET","POST","PUT","PATCH","DELETE"],
    credentials:true
}))

// app.use("/uploads/profiles",express.static("uploads/profiles"))
app.use('/uploads', express.static('uploads'))
app.use(cookieParser())
app.use(express.json())

app.use("/api/auth",authRoutes)
app.use("/api/contact",contactRoute)

app.use(errorHandler)
const server = app.listen(port,()=>{
    console.log("Server is running on",port)
})

mongoose.connect(databaseURL).then(()=>console.log('DB Connect Success')).catch(err=>console.log(err.message))