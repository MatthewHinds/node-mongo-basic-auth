require('dotenv').config();

const mongoose = require('mongoose');
const uri = process.env.MONGO_DB;

mongoose
    .connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .catch(e => {
        console.log(`Connection error`, e.message);
    });

const mongodb = mongoose.connection;

module.exports = mongodb;