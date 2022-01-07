const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');

const Schema = mongoose.Schema;
// const ObjectId = Schema.ObjectId;
const tests = new Schema(
    {
        name: { type: String },
        productTime: { type: Date }
    },
    {
        timestamps: true
    }
);
tests.plugin(mongoose_delete, { overrideMethods: 'all' });

module.exports = mongoose.model('tests', tests);
