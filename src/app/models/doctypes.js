const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');


const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const doctypes = new Schema(
    {
        type: { type: String, required: true },
        docGroup: { type: Schema.type.ObjectId, ref: 'docGroups' }
    }
);
doctypes.plugin(mongoose_delete, { overrideMethods: 'all' });

module.exports = mongoose.model('doctypes', doctypes);