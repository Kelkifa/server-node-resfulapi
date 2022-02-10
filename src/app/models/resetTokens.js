const mongoose = require('mongoose');


const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const resetTokens = new Schema(
    {
        token: { type: String, unique: true }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('resetTokens', resetTokens);
