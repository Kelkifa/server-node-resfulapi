const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');

const Schema = mongoose.Schema;
// const ObjectId = Schema.ObjectId;
const todo2s = new Schema(
    {
        title: { type: String },
        to: { type: Date },
        from: { type: Date },
        todoList: [{ todo: { type: String }, state: { type: Boolean } }], //0: doing, 1: done, 2:fail
        color: { type: String },
        groupId: { type: Schema.Types.ObjectId, ref: 'groups' }
    },
    {
        timestamps: true
    }
);
todo2s.plugin(mongoose_delete, { overrideMethods: 'all' });

module.exports = mongoose.model('todo2s', todo2s);
