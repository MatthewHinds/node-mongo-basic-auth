require('dotenv').config();

const express = require("express");
const db = require('./db/MongoDb');
const userRouter = require('./routes/UserRouter');
const cors = require('cors');
const app = express();
const apiPort = process.env.PORT;

app.use(cors());
app.use(express.json());

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use('/api', userRouter);

app.listen(apiPort, () => {
    console.log(`Server running on port ${apiPort}`);
});