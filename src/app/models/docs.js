const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');


const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const docs = new Schema(
    {
        title: { type: String, required: true },
        content: { type: String, required: true },
        typeId: { type: Schema.Types.ObjectId, ref: 'doctypes' }
    },
    {
        timestamps: true
    }
);
docs.plugin(mongoose_delete, { overrideMethods: 'all' });

module.exports = mongoose.model('docs', docs);
