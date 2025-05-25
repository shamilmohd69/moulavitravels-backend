const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()
const mongodburl = process.env.MONGODBURL;

const db = async () => {
    const connect = await mongoose.connect(mongodburl)
    console.log(`MongoDB connected successfully ${connect.connection.host}`);
}

module.exports = db;