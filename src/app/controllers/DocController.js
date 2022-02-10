const docModel = require('../models/docs');
const groupModel = require('../models/groups');


const todoModel = require('../models/todos');

const testModel = require('../models/tests');
const mongoose = require('mongoose');
class DocController {
    /**
     * [POST] /api/docs/getDocs
     * get docs users with the doc demo type
     * 
     * @param {*} req {userId}
     * @param {*} res 
     * @return user's docs and demo
     */
    async getDocs(req, res) {
        const { userId, groupId } = req.body;


        if (!groupId) return res.json({ success: false, message: 'bad request' });

        try {
            // Check user is in group
            const response = await docModel.aggregate([
                {
                    $lookup: { from: 'groups', localField: 'groupId', foreignField: '_id', as: 'group' }
                },
                {
                    $match: {
                        groupId: mongoose.Types.ObjectId(groupId),
                        // "group.users": userId
                        $or: [{ "group.type": 'demo' }, { "group.users": userId }]
                    }
                },
                {
                    $project: { groupId: 0, contents: 0, group: 0 }
                }

            ])

            // All good
            // const response = await docModel.find({ groupId: groupId }).select({ _id: 1, name: 1 });

            return res.json({ success: true, message: 'successfully', response });
        } catch (err) {
            console.log(`[Doc get docs]`, err);
            return res.json({ success: false, message: 'internal server' });

        }
    }

    /**
     * [POST] /api/docs/createDoc
     * 
     * Require Logged
     * @param {*} req {userId, groupId, name, title, content}
     * @param {*} res 
     * @returns create new doc with the first content
     */
    async createDoc(req, res) {
        const { userId, name, title, content, groupId } = req.body;

        if (!name || !title || !content || !groupId) return res.json({ success: false, message: 'bad request' });

        // if (!userId) return res.json({ success: false, message: 'need login' });


        try {
            // Check user in group
            const isUserInGroup = await groupModel
                .exists({ _id: groupId, $or: [{ type: 'demo' }, { users: userId }] });
            if (!isUserInGroup) return res.json({ success: false, message: 'not allow' });

            // All good

            const response = await docModel.create({ name, contents: [{ title, content }], groupId });
            return res.json({ success: true, message: 'successfully', response });


        } catch (err) {
            console.log(`[DOC CREATE ERROR]`, err);
            return res.json({ success: false, message: 'internal server' });
        }

    }


    /**
     * [POST] /api/docs/createContent
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    async creatContent(req, res) {
        const { userId, groupId, docId, title, content } = req.body;


        if (!groupId || !docId || !title || !content) return res.json({ success: false, message: 'bad request' });

        try {

            // Check user in group
            const isUserExistInGroup = await docModel
                .findOne({ _id: docId, groupId })
                .populate({ path: 'groupId', match: { $or: [{ type: 'demo' }, { users: userId }] }, select: '_id' })
                .select('_id groupId');

            if (!isUserExistInGroup) return res.json({ success: false, message: 'not allow' });
            if (!isUserExistInGroup.groupId) return res.json({ success: false, message: 'not allow' });

            const response = await docModel.findOneAndUpdate({ _id: docId }, { $push: { contents: { title, content } } }, { new: true });


            return res.json({ success: true, message: 'successfully', response });


        } catch (err) {
            console.log(`[DOC CREATE CONTENT ERR]`, err);
            return res.json({ success: false, message: 'internal server' });
        }
    }



    /**
     * [POST] /api/docs/getDetail
     * Get doc detail
     * public
     * 
     * @param {*} req {docId, groupId, userId}
     * @param {*} res 
     */
    async getDetail(req, res) {
        const { docId, userId, groupId } = req.body;

        if (!docId) return res.json({ success: false, message: 'bad request' });

        try {
            // Check user in group
            const isUserInGroup = await groupModel
                .exists({ _id: groupId, $or: [{ type: 'demo' }, { users: userId }] });
            if (!isUserInGroup) return res.json({ success: false, message: 'not allow' });

            const response = await docModel.findOne({ _id: docId, groupId: groupId });

            return res.json({ success: true, message: 'successfully', response });


        } catch (err) {
            console.log(`DOC GET DETAIL ERR`, err);
            return res.json({ success: false, message: 'internal server' });
        }

    }

    /**
     * [PATCH] /api/docs/updateDoc
     * @param {*} req {userId, docId, name}
     * @param {*} res 
     * @returns 
     */
    async updateDoc(req, res) {
        const { userId, docId, name } = req.body;

        if (!userId || !docId || !name) return res.json({ success: false, message: 'bad request' });

        try {
            // Check user in group
            const isUserExistInGroup = await docModel
                .findOne({ _id: docId })
                .populate({ path: 'groupId', match: { users: userId }, select: '_id' })
                .select('_id groupId');

            if (!isUserExistInGroup) return res.json({ success: false, message: 'Không tìm thấy tài liệu để cập nhật' });
            if (!isUserExistInGroup.groupId) return res.json({ success: false, message: 'Bạn không trong nhóm này' });


            const response = await docModel.findOneAndUpdate({ _id: docId }, { name }, { new: true });
            return res.json({ success: true, message: 'successfully', response });

        } catch (err) {

            console.log(`[DOC UPDATE DOC ERR]`, err);
            return res.json({ success: false, message: 'internal server' });
        }
    }


    /**
     * [PATCH] /api/docs/updateContent
     * logged
     * 
     * @param {*} req {userId, docId, contentId, title, content}
     * @param {*} res 
     */
    async updateContent(req, res) {
        const { userId, docId, contentId, title, content } = req.body;

        try {
            // Check user in group
            const isUserExistInGroup = await docModel
                .findOne({ _id: docId })
                .populate({ path: 'groupId', match: { $or: [{ type: 'demo' }, { users: userId }] }, select: '_id' })
                .select('_id groupId');


            if (!isUserExistInGroup) return res.json({ success: false, message: 'Không tìm thấy tài liệu để cập nhật' });
            if (!isUserExistInGroup.groupId) return res.json({ success: false, message: 'Bạn không trong nhóm này' });


            const response = await docModel
                .findOneAndUpdate(
                    { _id: docId, "contents._id": contentId },
                    { '$set': { 'contents.$': { title, content, _id: contentId } } },
                    { new: true }
                );

            return res.json({ success: true, message: 'successfully', response });

        } catch (err) {
            console.log(`[DOC UPDATE CONTENT ERR]`, err);
            return res.json({ success: false, message: 'internal server' });
        }

    }

    /**
     * [PATCH] /api/docs/deleteDoc
     * Sort delete a doc
     * @param {*} req {userId, groupId, docId}
     * @param {*} res 
     */
    async deleteDoc(req, res) {
        const { userId, docId, groupId } = req.body;

        try {
            // Check user in group
            const isUserExistInGroup = await docModel
                .findOne({ _id: docId, groupId })
                .populate({ path: 'groupId', match: { users: userId }, select: '_id' })
                .select('_id groupId');

            if (!isUserExistInGroup) return res.json({ success: false, message: 'Không tìm thấy tài liệu để xoá' });
            if (!isUserExistInGroup.groupId) return res.json({ success: false, message: 'Bạn không trong nhóm này' });

            await docModel.delete({ _id: docId });

            return res.json({ success: true, message: 'successfully' });
        } catch (err) {
            console.log(`[DOC DELETE DOC ERR]`, err);
            return res.json({ success: false, message: 'internal server' });
        }
    }

    /**
     * [PATCH] /api/docs/deleteContent
     * @param {*} req {userId, docId, contentId}
     * @param {*} res 
     * @returns 
     */
    async deleteContent(req, res) {
        const { userId, docId, contentId } = req.body;

        try {

            // Check user in group
            const isUserExistInGroup = await docModel
                .findOne({ _id: docId })
                .populate({ path: 'groupId', match: { users: userId }, select: '_id' })
                .select('_id groupId');

            if (!isUserExistInGroup) return res.json({ success: false, message: 'Không tìm thấy tài liệu để xoá' });
            if (!isUserExistInGroup.groupId) return res.json({ success: false, message: 'Bạn không trong nhóm này' });

            await docModel.updateOne({ _id: docId }, { $pull: { contents: { _id: contentId } } });


            const response = await docModel.findOne({ _id: docId });
            return res.json({ success: true, message: 'succesfully', response });



        } catch (err) {
            console.log(`[DOC DELETE CONTENT ERR]`, err);

            return res.json({ success: false, message: err })
        }

    }

    /**
     * [POST] /api/docs/alwaysChange
     * always change
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    async alwaysChange(req, res) {
        try {

            const response = await todoModel.aggregate([
                {
                    $lookup: { from: 'groups', localField: 'groupId', foreignField: '_id', as: 'groupId' }
                },
                {
                    $match: { title: { $regex: 'noel', $options: 'i' } }
                }
            ])
            // const response = await todoModel.find({ groupId: "61e1909df989f24f501e27ec" });
            return res.json({ success: true, message: 'successfully', response });

        } catch (err) {
            console.log(err);
            return res.json({ success: false, message: 'internal server' })
        }
    }

}
module.exports = new DocController;

