const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');

const Schema = mongoose.Schema;
// const ObjectId = Schema.ObjectId;
const todoOrigin = new Schema(
    {
        content: { type: String },
        to: { type: Object },
        from: { type: Object },
        startTime: { type: Array },
        endTime: { type: Array },
        todoList: [{ todo: { type: String }, state: { type: Number } }], //0: doing, 1: done, 2:fail
        color: { type: String },
        groupId: { type: Schema.Types.ObjectId, ref: 'groups' }
    },
    {
        timestamps: true
    }
);
todoOrigin.plugin(mongoose_delete, { overrideMethods: 'all' });

module.exports = mongoose.model('todos', todoOrigin);
