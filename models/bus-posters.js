const mongoose = require('mongoose');

const busposter = new mongoose.Schema({
    image: String,
    desc: String,
    public_id: String,
});

const busposters = mongoose.model('BusPosters', busposter);

module.exports = busposters;