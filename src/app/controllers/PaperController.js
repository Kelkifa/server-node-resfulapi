const paperModel = require('../models/papers');
const mongoose = require('mongoose');
class PaperController {

    /**
     * [POST] /api/paper/createPaper
     * @param {Object} req {userId ,groupId, paperName, paperTitle, paperContent}
     * @param {*} res 
     * @returns 
     */
    async CreatePaper(req, res) {
        const { userId, groupId, paperName, paperTitle, paperContent } = req.body;
        if (!userId || !groupId) return res.json({ success: false, message: 'bad request' });

        try {
            const newPaper = {
                name: paperName,
                contentList: [{ title: paperTitle, data: paperContent }],
                groupId
            }

            const response = await paperModel.create(newPaper);

            return res.json({ success: true, message: 'successfully', response })
        } catch (err) {
            console.log(err);
            return res.json({ success: false, message: 'internal server' });
        }
    }

    /**
     * [POST] /api/paper/getPaperList
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    async GetPaperList(req, res) {
        const { userId, groupId } = req.body;
        if (!groupId) return res.json({ success: false, message: 'bad request' });

        try {
            const response = await paperModel.aggregate([
                {
                    $lookup: {
                        from: 'groups',
                        localField: "groupId", foreignField: "_id",
                        as: "group"
                    }
                },
                {
                    $match: {
                        groupId: mongoose.Types.ObjectId(groupId),
                        $or: [{ "group.users": userId }, { "group.type": "demo" }]
                    }
                },
                {
                    $project: {
                        group: 0,
                        "contentList.data": 0,
                        groupId: 0,
                        updatedAt: 0,
                        createdAt: 0
                    }
                }

            ])

            return res.json({ success: true, message: 'successfully', response })

        } catch (err) {
            console.log(err);
            return res.json({ success: false, message: 'Internal Server' })
        }
    }

    /**
     * [POST] /papers/getDetail
     */
    async GetPaperDetail(req, res) {
        const { userId, groupId, docId } = req.body;

        if (!groupId || !docId) return res.json({ success: false, message: 'bad request' });

        try {
            const response = await paperModel.aggregate([
                {
                    $lookup: {
                        from: 'groups',
                        localField: "groupId", foreignField: "_id",
                        as: "group"
                    }
                },
                {
                    $match: {
                        _id: mongoose.Types.ObjectId(docId),
                        groupId: mongoose.Types.ObjectId(groupId),
                        $or: [{ "group.users": userId }, { "group.type": "demo" }]
                    }
                },
                {
                    $project: {
                        group: 0,
                        groupId: 0,
                        updatedAt: 0,
                        createdAt: 0
                    }
                }
            ])
            if (response.length === 0) {
                return res.json({ success: false, message: 'not found' })
            }
            return res.json({ success: true, message: 'successfully', response: response[0] })

        } catch (err) {
            console.log(err);
            return res.json({ success: false, message: 'internal server' })
        }
    }
    /**
     * [POST] /api/paper/alwayChange
     * @param {Object} req {}
     * @param {*} res 
     */
    async AlwayChange(req, res) {
        try {
            const response = await paperModel.deleteMany();
            return res.json({ success: true, message: 'successfully', response })

        } catch (err) {
            console.log(err);
            return res.json({ success: false, message: 'internal server' })
        }
    }
}

module.exports = new PaperController;