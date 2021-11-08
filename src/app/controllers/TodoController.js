const todoModel = require('../models/todos');
const groupModel = require('../models/groups');
const params = require('../../cores/params');

class NoteController {
    /** [POST] /api/todos/get 
     *  Get all note of user
     *  Public (logged)
    */
    async get(req, res) {
        const { userId, groupId } = req.body;
        try {
            // Check user in group
            const isUserInGroup = await groupModel
                .exists(
                    {
                        _id: groupId,
                        $or: [{ type: params.DEMO_GROUP_TYPE }, { users: userId }]
                    },
                );

            if (!isUserInGroup) return res.json({ success: false, message: 'Bạn không trong nhóm này' });


            const response = await todoModel.find({ groupId }).sort({ createdAt: 'desc' });
            return res.json({ success: true, message: 'successfully', response });
        } catch (err) {
            console.log('[ERROR]', err);
            return res.status(500).json({ success: false, message: 'internal server', response });
        }
    }

    /** [POST] /api/notes/add
     *  Add a new note
     *  public (logged)
     */
    async add(req, res) {
        const { data } = req.body;
        // console.log('[data]', data);
        const newTodo = await todoModel.create(data);
        // console.log('[newTodo]', newTodo);

        return res.json({ success: true, message: 'succesfully', response: newTodo });
    }
    /** [DELETE] /api/todos/deletes
     *  Delete all todo list
     *  dev
    */
    // async deletes(req, res) {
    //     try {
    //         await todoModel.deleteMany({});
    //         return res.json({ success: true, message: 'successfully' });
    //     } catch (err) {
    //         return res.status(500).json({ success: false, message: 'internal server' });
    //     }
    // }

    /** [DELETE] /api/todos/delete 
     *  Delete a todo
     *  public (logged)
    */
    async delete(req, res) {
        const { data } = req.body;
        console.log(data);
        // console.log(`[req body]`, req.body);
        if (!data) return req.status(404).json({ success: false, message: 'bad request' });
        try {
            await todoModel.deleteOne({ _id: data });
            return res.json({ success: true, message: 'successfully', response: data });
        } catch (err) {
            return res.status(500).json({ success: false, message: 'internal server' });
        }
    }
    // async test(req, res) {
    //     console.log(req.body);
    //     return res.json({ success: true, message: 'succesfully' });
    // }
}

module.exports = new NoteController;