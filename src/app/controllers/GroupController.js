const groupModel = require('../models/groups');

class GroupController {
    /**
     * [GET] /api/groups/getDemo
     * @param {*} req 
     * @param {*} res 
     */
    async getDemoGroups(req, res) {
        try {
            const response = await groupModel.findOne({ type: 'demo' });
            return res.json({ success: true, message: 'successfully', response });
        } catch (err) {
            console.log(`[GROUP GET DEMO ERR]`, err);
            return res.json({ success: false, message: 'internal server' });
        }
    }


    /**
     * [GET] /api/groups/get
     * Get all group of user by userId
     * @param {*} req 
     * @param {*} res 
     */
    async get(req, res) {
        const { userId } = req.body;

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
    * [POST] /api/groups/create
    * Create a new group
    * @param {*} req req.body = {name: String, username : {type: Array, desc: Array of user in group}}
    * @param {*} res 
    */

    async create(req, res) {
        const { userId, name, usernames = [] } = req.body;

        if (!userId) return res.json({ success: false, message: 'need signin' });
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
}

module.exports = new GroupController;