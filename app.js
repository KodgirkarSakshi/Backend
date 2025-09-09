const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./db/db');
const userRoutes = require('./routes/userRoutes');
const cookieParser = require('cookie-parser');

dotenv.config();
connectDB();
app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/users", userRoutes);



app.get('/', (req, res) => {
    res.send('Hello World!');
});

module.exports = app;