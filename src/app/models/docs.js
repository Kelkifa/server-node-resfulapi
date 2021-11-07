const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');


const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const docs = new Schema(
    {
        name: { type: String, required: true },
        contents: [
            {
                title: { type: String, required: true, },
                content: { type: String, required: true }
            }
        ],
        groupId: { type: Schema.Types.ObjectId, ref: 'groups' }
    },
    {
        timestamps: true
    }
);
docs.plugin(mongoose_delete, { overrideMethods: 'all' });

module.exports = mongoose.model('docs', docs);
