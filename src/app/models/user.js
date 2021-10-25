const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');

const Schema = mongoose.Schema;
// const ObjectId = Schema.ObjectId;
const user = new Schema(
    {
        fullname: { type: String },
        username: { type: String, isRequired: true, unique: true },
        password: { type: String, isRequired: true },
        isAdmin: { type: Boolean, default: false },
    },
    {
        timestamps: true
    }
);
user.plugin(mongoose_delete, { overrideMethods: 'all' });

module.exports = mongoose.model('users', user);
