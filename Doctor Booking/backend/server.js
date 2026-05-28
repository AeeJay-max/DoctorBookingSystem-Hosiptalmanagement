import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import adminRouter from './routes/adminRoutes.js'
import doctorRouter from './routes/doctorRoutes.js'
import userRouter from './routes/userRoute.js'
import patRouter from './routes/patientRoutes.js'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'

const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
})

app.use(helmet({
    contentSecurityPolicy: false,
}))

app.use(limiter)
app.use(express.json())
app.use(cors())

app.use('/api/admin', adminRouter)
app.use('/api/doctor', doctorRouter)
app.use('/api/user', userRouter)
app.use('/api/pat', patRouter)

app.get('/', (req, res) => {
    res.send('API WORKING')
})

app.listen(port, () => console.log("Server Started", port))