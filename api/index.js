import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import userRouter from './routes/user.route.js'
import authRouter from './routes/auth.route.js'
import listingRouter from './routes/listing.route.js'
import cookieParser from 'cookie-parser';
import path from 'path';

dotenv.config();

mongoose.connect(process.env.MONGO).then(() => {
    console.log('connected to MongoDB')
}).catch((err) => {
    console.log(err);
})



const app = express();

app.use(express.json());

app.use(cookieParser())

const port = process.env.PORT || 4000

const __dirname = path.resolve();

app.listen(port, () => {
    console.log('Server is running on port 4000!!')
})

app.use("/api/user", userRouter)
app.use("/api/auth", authRouter)
app.use("/api/listings", listingRouter)

app.use(express.static(path.join(__dirname, '/Client/dist')))

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, 'Client', 'dist', 'index.html'));
})

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error'
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    })
})