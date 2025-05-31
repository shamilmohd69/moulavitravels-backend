const mongoose = require('mongoose');

const busservicedb = new mongoose.Schema({
    title: String,
    desc: String,
});

const busservice = mongoose.model('BusService', busservicedb);

module.exports = busservice;