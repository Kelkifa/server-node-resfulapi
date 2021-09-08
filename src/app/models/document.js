const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');


const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const documents = new Schema(
    {
        type: { type: String },
        parent_part: {
            title: { type: String }
        },
        children_parts: [
            {
                _id: false,
                index: Number,
                title: String,
                content: [String],
                sort: [Number]
            }
        ]
    },
    {
        timestamps: true
    }
);
documents.plugin(mongoose_delete, { overrideMethods: 'all' });

module.exports = mongoose.model('documents', documents);
