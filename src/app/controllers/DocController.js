const docModel = require('../models/docs');
const groupModel = require('../models/groups');
const userModel = require('../models/user');


class DocController {

    /**
     * [POST] /api/docs/createGroup
     * create a group to add member by username
     * @param {*} req req.body = {name: String, username : {type: Array, desc: Array of user in group}}
     * @param {*} res 
     */

    async createGroup(req, res) {
        const { name, usernames = [] } = req.body;

        if (!name) return res.json({ success: false, message: 'bad request' });

        try {
            const foundUser = await userModel.find({ username: { $in: usernames } }).select('_id');

            const response = await groupModel.create({ name, users: foundUser.map(value => value._id) })

            return res.json({ success: true, message: 'successfully', response });
        } catch (err) {
            console.log(`[create group err]`, err);
            return res.json({ success: false, message: 'internal server' });
        }
    }

    /**
     * [GEt] /api/docs/getGroups
     * 
     * @param {Object} req request
     * @param {Object} res response
     * @returns 
     */
    async getGroup(req, res) {
        const { userId } = req.body

        try {
            // Get group with type === demo  ||  userId in user of group
            const response = await groupModel.find({ $or: [{ type: 'demo' }, { users: userId }] }).populate({ path: 'users', select: "_id username fullname" });

            return res.json({ success: true, message: 'successfully', response });

        } catch (err) {
            console.log(`[DOC GET GROUP ERR]`, err);
            return res.json({ success: false, message: 'internal server' });
        }
    }

    /**
     * [POST] /api/docs/createDoc
     * @param {object} req {name: the doc name, title: first title content of doc, content: the first content, groupId: doc of this group} 
     * @param {*} res 
     * @returns 
     */
    async createDoc(req, res) {
        const { name, title, content, groupId, userId } = req.body;

        /** There is null request */
        if (!name || !title || !content) return res.json({ success: false, message: 'bad request' });

        try {
            /** Find group by groupId */
            const foundGroup = await groupModel.findOne({ _id: groupId }).select('_id type');

            /** Group is not exist */
            if (!foundGroup) return res.json({ success: false, message: 'Group not exist' });

            /** Create the demo doc */
            if (foundGroup.type === 'demo') {
                const response = await docModel.create({ name, contents: [{ title, content }], groupId: foundGroup._id });
                return res.json({ success: true, message: 'successfully', response });
            }

            /**  Create doc of user */
            if (!userId) return res.json({ success: false, message: 'bad request' });

            // Checking user is in group
            const existUserFlag = await groupModel.exists({ _id: foundGroup._id, users: userId });
            if (!existUserFlag) return res.json({ success: false, message: 'not allow' });

            // All good
            const response = await docModel.create({ name, contents: [{ title, content }], groupId: foundGroup._id });

            return res.json({ success: true, message: 'successfully', response });
        }
        catch (err) {
            console.log(`[CREATE DOC ERRR]`, err);
            return res.json({ success: false, message: 'internal server' });
        }
    }

    /**
     * [GET] /api/docs/getDoc
     * public for getting demo doc || logged fro getting demo and user's docs
     * @param {Object} req {userId: { id of user(nullable) },   groupId: {id of group}}
     * @param {*} res 
     * @returns {Array} docs list
     */
    async getDocNameList(req, res) {
        const { userId, groupId } = req.body;

        if (!groupId) return res.json({ success: false, message: 'bad request' });

        try {
            /** Not see group or user in group */
            const groupExistFlag = await groupModel.findOne({ _id: groupId, $or: [{ users: userId }, { type: 'demo' }] }).select('_id type');
            if (!groupExistFlag) return res.json({ success: false, message: 'not found' });

            /** Get Docs */
            // All good
            const response = await docModel.find({ groupId: groupId }).select('_id name');
            return res.json({ success: true, message: 'successfully', response: response });
        } catch (err) {
            console.log(`[DOC GET ERR]`, err);
            return res.json({ success: false, message: 'internal server' });
        }
    }

    /**
     * [GET] /api/docs/getDocDetail
     * Get detail of docs (contents , name)
     * @param {*} req {userId, groupId, docId}
     * @param {*} res 
     */

    async getDocDetail(req, res) {
        const { userId, groupId, docId } = req.body;

        if (!docId || !groupId) return res.json({ success: false, message: 'bad request' });

        try {
            /** Not see group or user in group */
            const groupExistFlag = await groupModel.findOne({ _id: groupId, $or: [{ users: userId }, { type: 'demo' }] }).select('_id type');
            if (!groupExistFlag) return res.json({ success: false, message: 'not found' });

            /** Get doc */
            // All good
            const response = await docModel.findOne({ _id: docId, groupId });
            return response.json({ success: true, message: 'successfully', response });

        } catch (err) {
            console.log(`[DOC GET DETAIL ERR]`, err);
            return res.json({ success: false, message: 'internal server' });
        }
    }
}

module.exports = new DocController;