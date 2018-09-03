const mongoose = require('mongoose');

const managerSchema = new mongoose.Schema({
    "username": { type: String, index: { unique: true, dropDups: true}},
    "password": String,
    "managerId": { type: String, index: { unique: true, dropDups: true}}
})

const model = mongoose.model('manager', managerSchema);

module.exports = model;