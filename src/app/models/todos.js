const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');

const Schema = mongoose.Schema;
// const ObjectId = Schema.ObjectId;
const todos = new Schema(
    {
        content: { type: String },
        to: {
            date: { type: Number, required: true },
            month: { type: Number, required: true },
            year: { type: Number, required: true }
        },
        from: {
            date: { type: Number, required: true },
            month: { type: Number, required: true },
            year: { type: Number, required: true }
        },
        startTime: { type: Array, default: [0, 0] },
        endTime: { type: Array, default: [0, 0] },
        color: { type: String }
    },
    {
        timestamps: true
    }
);
todos.plugin(mongoose_delete, { overrideMethods: 'all' });

module.exports = mongoose.model('todos', todos);
