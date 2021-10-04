const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');


const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const docs = new Schema(
    {
        codes: { type: Array, default: [] },
        images: { type: Array, default: [] },
        docs: { type: Array, default: [] },
        typeId: { type: Schema.Types.ObjectId, ref: 'docTypes' }
    },
    {
        timestamps: true
    }
);
docs.plugin(mongoose_delete, { overrideMethods: 'all' });

module.exports = mongoose.model('docs', docs);
