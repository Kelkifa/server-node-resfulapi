const docTypeModel = require('../models/doctypes');
const docModel = require('../models/docs');
const docGroupModel = require('../models/docGroups');
const userModel = require('../models/user');

class DocController {
    /** [GET] /api/docs/getTypes
     *  Get type list (e.g: [nodejs, javascript,...])
     *  
     */
    async getTypeList(req, res) {

        try {
            const response = await docTypeModel.find();
            return res.json({ success: true, message: 'successfully', response });
        }
        catch (err) {
            console.log(`[doc getTypeList err]`, err);
            res.status(500).json({ success: false, message: 'internal server' });
        }
    }

    /** [POST] /api/docs/getContent
     *  Get content from type req data (req is typeId)
     *  Publich (logged)
     */
    async getContent(req, res) {
        const { data } = req.body;
        if (!data) return res.status(400).json({ success: false, message: 'bad requrest' });
        try {
            const response = await docModel.find({ typeId: data });
            return res.json({ success: true, message: 'successfully', response });

        } catch (err) {
            console.log(`[doc err]`, err);
            return res.statue(500).json({ success: false, message: 'internal server' });
        }
    }





    /** [POST] /api/docs/createDoc 
     *  Save data from client
     *  DataSchema: { 
     *      type: {type: String, e.g: nodejs}, 
     *      title: {type: String, e.g: 'tieu de'}, 
     *      content: {type: String. e.g: 'noi dung'}
     * } 
     *  Public (Logged)
    */
    async createDoc(req, res) {
        const { data } = req.body;
        // return res.json({ success: true, message: 'successfully' });
        if (!data) {
            return res.status(400).json({ success: false, message: 'bad request', response: newDocType });
        }

        try {
            const newDocType = await docTypeModel.create({ type: data.type });
            const { title, content } = data;
            const newDoc = await docModel.create({ title, content, typeId: newDocType._id });

            return res.json({ success: true, message: 'successfully', response: newDocType });
        } catch (err) {
            console.log(err)
            return res.status(500).json({ success: false, message: 'internal server' });
        }

    }
    /** [POST] /api/docs/createContent 
     *  Save data from client
     *  DataSchema: { 
     *      type: {type: String, e.g: nodejs}, 
     *      title: {type: String, e.g: 'tieu de'}, 
     *      content: {type: String. e.g: 'noi dung'}
     * } 
     *  Public (Logged)
    */
    async createContent(req, res) {
        const { data } = req.body;
        if (!data) return res.status(404).json({ success: false, message: 'bad request' })

        try {

            // Kiểm tra tồn tại typeId
            const existTypeId = await docTypeModel.findOne({ _id: data.type });
            if (!existTypeId) return res.status(404).json({ success: false, message: 'bad request' });

            const newData = { ...data, typeId: data.type };
            const response = await docModel.create(newData);

            return res.json({ success: true, message: 'Successfully', response });
        } catch (err) {
            console.log(err)
            return res.status(500).json({ success: false, message: 'internal server' });
        }

    }
    /** [PUT] /api/docs/updateContent
     *  Update a content in docModel
     *  public (logged)
     */
    async updateContent(req, res) {
        const { data } = req.body;
        if (!data)
            return res.status(404).json({ success: false, message: 'bad request' });
        const { _id, title, content, typeId } = data;
        if (!_id || !title || !content || !typeId)
            return res.status(404).json({ success: false, message: 'bad request' });
        try {
            const response = await docModel.findOneAndUpdate({ _id: data._id }, { title, content }, { new: true });
            console.log(`[response]`, response);

            return res.json({ success: true, message: 'successfully', response });
        } catch (err) {
            console.log(`[DOC UPDATE CONTENT ERR]`, err);
            return res.status(500).json({ success: false, message: 'internal server' })
        }

    }

    /** [DELETE] /api/docs/deleteDoc
     *  Delete a doc
     *  Public (logged)
     */
    async deleteDoc(req, res) {
        const { data: docId } = req.body;
        console.log("[docId]", req.body);


        // return res.json({ success: true, message: 'bad requres' });
        if (!docId) return res.status(404).json({ success: true, message: 'bad requres' });

        try {
            await Promise.all([
                docTypeModel.delete({ _id: docId }),
                docModel.delete({ typeId: docId })
            ]);

            return res.json({ success: true, message: 'successfully' });

        } catch (err) {

            console.log(`[DOC DELETE ERR]`, err);
            res.status(500).json({ success: true, message: 'internal sever' });
        }

    }
    /** [DELETE] /api/docs/deleteContent
     *  Delete a title and its content of doc by typeId
     *  public (logged)
     */
    async deleteContent(req, res) {
        const { data: docContentId } = req.body;
        if (!docContentId) return res.status(404).json({ success: false, message: 'bad request' });
        try {
            await docModel.delete({ _id: docContentId });

            return res.json({ success: true, message: 'successfully' });
        } catch (err) {
            console.log(`[DOC DELETE CONTENT ERR]`, err);
            return res.status(500).json({ success: true, message: 'internal sever' });
        }
    }




    /**** TEST ***/

    /**
     * [POST] /api/docs/createGroup
     * create a group to add member
     * @param {*} req req.body = {name: String}
     * @param {*} res 
     */

    async createDocGroup(req, res) {
        const { name, usernames = [] } = req.body;

        console.log(req.body);
        if (!name) return res.json({ success: false, message: 'bad request' });

        try {
            const foundUser = await userModel.find({ username: { $in: usernames } }).select('_id');

            const response = await docGroupModel.create({ name, users: foundUser.map(value => value._id) })

            return res.json({ success: true, message: 'successfully', response });
        } catch (err) {
            console.log(`[create group err]`, err);
            return res.json({ success: false, message: 'internal server' });
        }
    }

    /**
     * [GEt] /api/docs/getGroup
     * 
     * @param {Object} req request
     * @param {Object} res response
     * @returns 
     */
    async getDocGroup(req, res) {
        try {
            const response = await docGroupModel.find().populate({ path: 'users', select: "_id username fullname" });

            return res.json({ success: true, message: 'successfully', response });

        } catch (err) {
            return res.json({ success: false, message: 'internal server' });
        }
    }

}

module.exports = new DocController;