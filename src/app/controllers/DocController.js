const docTypeModel = require('../models/doctypes');
const docModel = require('../models/docs');
const mongoose = require('mongoose');

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
    /** [DELETE] /api/docs/delete
     *  Delete a doc
     *  Public (logged)
     */
    async delete(req, res) {
        const { data: docId } = req.body;
        // console.log("[docId]", req.body);


        // return res.json({ success: true, message: 'bad requres' });
        if (!docId) return res.status(404).json({ success: true, message: 'bad requres' });

        try {
            await Promise.all([
                docTypeModel.delete({ _id: docId }),
                docModel.deleteMany({ typeId: docId })
            ]);

            return res.json({ success: true, message: 'successfully' });

        } catch (err) {

            console.log(`[DOC DELETE ERR]`, err);
            res.status(500).json({ success: true, message: 'internal sever' });
        }

    }

}

module.exports = new DocController;