const mongoose = require('mongoose');

const bustimingdb = new mongoose.Schema({
    route: String,
    destination: String,
    time: String,
    daysAvailable: String,
    status: String,
});

const bustiming = mongoose.model('Bustiming', bustimingdb);

module.exports = bustiming;