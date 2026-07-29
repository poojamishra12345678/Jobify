import express from 'express';
import studentRoute from './routes/studentRoute.js';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import companyRoute from './routes/companyRoute.js';

import cors from 'cors';



dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
    origin:["http://localhost:5173","http://localhost:5174"],
    credentials:true
}))

const PORT = process.env.PORT || 5000;

app.use('/student', studentRoute);
app.use('/company', companyRoute);

const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

startServer();