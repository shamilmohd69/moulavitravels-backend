const mongoose = require('mongoose');

const heroblogdb = new mongoose.Schema({
    title: String,
    desc: String,
});

const heroblog = mongoose.model('Hero', heroblogdb);

module.exports = heroblog;