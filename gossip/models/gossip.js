const mongoose = require('mongoose');

const gossipSchema = new mongoose.Schema({
    "gossipId": { type: String, index: { unique: true, dropDups: true}, ref: 'user'},
    "title": String,
    "content": String,
    "file": String
})

const model = mongoose.model('gossip', gossipSchema);

module.exports = model;