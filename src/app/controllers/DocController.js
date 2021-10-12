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

    /** [POST] /api/docs/create 
     *  Save data from client
     *  DataSchema: { 
     *      type: {type: String, e.g: nodejs}, 
     *      title: {type: String, e.g: 'tieu de'}, 
     *      content: {type: String. e.g: 'noi dung'}
     * } 
     *  Public (Logged)
    */
    async create(req, res) {
        const { data } = req.body;
        // console.log(`[req body]`, req.body);
        // return res.json({ success: true, message: 'successfully' });
        if (!data || !data.type || !data.content || !data.title) {
            return res.status(400).json({ success: false, message: 'bad request' });
        }

        try {
            const { type } = data;
            const foundDocType = await docTypeModel.findOne({ type });

            if (!foundDocType) {
                const newDocType = await docTypeModel.create({ type });
                data.typeId = newDocType._id;
            }
            else {
                data.typeId = foundDocType._id;
            }

            // console.log(`[data]`, data);

            const newData = await docModel.create(data);

            return res.json({ success: true, message: 'successfully', response: newData });


        } catch (err) {
            console.log(err)
            return res.status(500).json({ success: false, message: 'internal server' });
        }
    }

}

module.exports = new DocController;