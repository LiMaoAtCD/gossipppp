const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    "userId": { type: String, index: { unique: true, dropDups: true}},
    "cellphone": String,
    "nickname": String,
    "address": String,
    "openid": String
})

const model = mongoose.model('user', userSchema);

module.exports = model;