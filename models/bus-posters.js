const mongoose = require('mongoose');

const busposter = new mongoose.Schema({
    image: String,
    desc: String,
});

const busposters = mongoose.model('BusPosters', busposter);

module.exports = busposters;