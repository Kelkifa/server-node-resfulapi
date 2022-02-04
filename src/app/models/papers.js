const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');


const Schema = mongoose.Schema;
const papers = new Schema(
    {
        name: { type: String, required: true },
        contentList: [{ title: { type: String }, data: { type: String } }],
        groupId: { type: Schema.Types.ObjectId, ref: 'groups', required: true },
    },
    {
        timestamps: true
    }
);
papers.plugin(mongoose_delete, { overrideMethods: 'all' });

module.exports = mongoose.model('papers', papers);
