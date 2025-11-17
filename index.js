require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const hrmsRoutes = require('./routes/hrms.routes');
const cors = require("cors");

const app = express();

const corsOptions = {
  origin: [
    'http://localhost:4200',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, 
};

app.use(cors(corsOptions)); 
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// Connect DB
connectDB();

// Middlewares
// app.use(express.json());

// Routes
app.use("/api/hrms", hrmsRoutes);

app.get("/", (_, res) => {
  return res.status(200).json("HRMS Is Up And Running...!");
});

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
