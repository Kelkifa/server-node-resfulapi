const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');


const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const groups = new Schema(
    {
        name: { type: String },
        users: [{ type: String, ref: 'users' }],
        type: { type: String, default: 'user' }
    },
);
groups.plugin(mongoose_delete, { overrideMethods: 'all' });

module.exports = mongoose.model('groups', groups);
