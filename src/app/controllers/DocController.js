const docModel = require('../models/docs');
const groupModel = require('../models/groups');
const userModel = require('../models/user');

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
            const isUserInGroup = await groupModel
                .exists({ _id: groupId, $or: [{ type: 'demo' }, { users: userId }] });
            if (!isUserInGroup) return res.json({ success: false, message: 'not allow' });

            // All good
            const response = await docModel.find({ groupId: groupId }).select({ _id: 1, name: 1 });

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

        if (!userId) return res.json({ success: false, message: 'need login' });


        try {
            // Check user in group
            const isUserInGroup = await groupModel
                .exists({ _id: groupId, users: userId, $not: { type: 'demo' } });
            if (!isUserInGroup) return res.json({ success: false, message: 'not allow' });

            // All good
            const newDoc = new docModel({
                name,
                content: [
                    title,
                    content
                ],
                groupId
            })

            const response = await newDoc.save(newDoc);
            return res.json({ success: true, message: 'successfully', response });


        } catch (err) {
            console.log(`[DOC CREATE ERROR]`, err);
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

}
module.exports = new DocController;

