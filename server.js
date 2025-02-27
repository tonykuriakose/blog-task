import express from 'express'
import connectDB from './src/config/db.js'
import authRoutes from './src/routes/authRoutes.js'
import userRoutes from './src/routes/userRoutes.js'
import blogRoutes from './src/routes/blogRoutes.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'
const PORT = 3001


const app = express();

app.use(express.json());

app.use(cors({
  origin: "https://blog-task-client.onrender.com",
  credentials: true,  
}));


  app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/blog', blogRoutes);


app.listen(PORT, () => {
    console.log("Server running")
    connectDB();
})