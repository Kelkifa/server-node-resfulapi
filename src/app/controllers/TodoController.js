const todoModel = require('../models/todos');
const groupModel = require('../models/groups');
const params = require('../../cores/params');
const mongoose = require('mongoose');

class TodoController {
    /** [POST] /api/todos/get 
     *  Get all note of user
     *  Public (logged)
    */
    async get(req, res) {
        // return res.sendStatus(401);
        const { userId, groupId, year, month } = req.body;

        if (!groupId || year == undefined || !month == undefined) return res.json({ success: false, message: 'bad request' });
        // 

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


            const startDateInMonth = new Date(year, month, 1);
            const endDateInMonth = new Date(year, month + 1, 0);

            const startDate = new Date(year, month, 1 - startDateInMonth.getDay());
            const endDate = new Date(year, month, endDateInMonth.getDate() + 6 - endDateInMonth.getDay())

            const response = await todoModel.find({
                from: { $not: { $gt: endDate } },
                to: { $not: { $lt: startDate } },
                groupId,
            }).sort({ from: 'asc' });

            // console.log(response);
            return res.json({ success: true, message: 'successfully', response });

        } catch (err) {
            console.log('[TODO GET ERROR]', err);
            return res.status(500).json({ success: false, message: 'internal server', response });
        }
    }


    /**
     * [POST] /api/todos/getPassed
     * @param {*} req {groupId}
     * @param {*} res 
     * @returns {Array} Passed Notes (to < new Date())
     */
    async getPassed(req, res) {
        const { groupId, userId } = req.body;
        if (!groupId) return res.json({ success: false, message: 'bad request' });
        try {
            const isUserInGroup = await groupModel
                .exists(
                    {
                        _id: groupId,
                        $or: [{ type: params.DEMO_GROUP_TYPE }, { users: userId }]
                    },
                );

            if (!isUserInGroup) return res.json({ success: false, message: 'Bạn không trong nhóm này' });

            const response = await todoModel.find({ groupId, to: { $lt: new Date() } }).sort({ to: 'asc' });
            return res.json({ success: true, message: 'successfully', response });

        } catch (err) {
            console.log(err);
            return res.json({ success: false, message: 'internal server' });
        }
    }
    /** [POST] /api/notes/add
     *  Add a new note
     *  public (logged)
     */
    async add(req, res) {
        const { data, userId, groupId } = req.body;

        if (!groupId || !data) return res.json({ success: false, message: 'bad request' });

        try {
            const isUserInGroup = await groupModel
                .exists(
                    {
                        _id: groupId,
                        $or: [{ type: params.DEMO_GROUP_TYPE }, { users: userId }]
                    },
                );

            if (!isUserInGroup) return res.json({ success: false, message: 'Bạn không trong nhóm này' });

            // console.log('[data]', data);
            const newData = { ...data, groupId, from: new Date(data.from), to: new Date(data.to) }
            // console.log(newData);
            const response = await todoModel.create(newData);
            // console.log('[newTodo]', newTodo);

            return res.json({ success: true, message: 'succesfully', response });

        } catch (err) {

            console.log(`[TODO CREATE TODO]`, err);
            return res.json({ success: true, message: 'internal server' });
        }


    }


    /**
     * [POST] /api/todos/addTodo
     * @param {object} req {groupId, userId, todoName}
     * @param {*} res 
     * @returns 
     */
    async addTodo(req, res) {
        const { userId, groupId, todoName, todoId } = req.body;

        if (!groupId || !todoName || !todoId) return res.json({ success: false, message: 'bad request' });

        try {
            const isUserInGroup = await groupModel
                .exists(
                    {
                        _id: groupId,
                        $or: [{ type: params.DEMO_GROUP_TYPE }, { users: userId }]
                    },
                );
            if (!isUserInGroup) return res.json({ success: false, message: 'Bạn không trong nhóm này' });

            const response = await todoModel.findOneAndUpdate(
                { _id: todoId, groupId },
                { $push: { todoList: { todo: todoName, state: false } } }, { new: true }
            )
            return res.json({ success: true, message: 'successfully', response });

        } catch (err) {
            console.log(`[todo add err]`, err);
            return res.json({ success: true, message: 'internal server' });
        }

    }


    /**
     * [POST] /api/todos/changeState
     * @param {*} req {noteId, todoId, state}
     * @param {*} res 
     * @returns 
     */
    async changeState(req, res) {
        const { noteId, todoId, state, userId, groupId } = req.body;

        if (!noteId || !todoId || state == undefined || !userId || !groupId) return res.json({ success: false, message: 'bad request' });

        try {

            const isUserInGroup = await groupModel
                .exists(
                    {
                        _id: groupId,
                        $or: [{ type: params.DEMO_GROUP_TYPE }, { users: userId }]
                    },
                );
            if (!isUserInGroup) return res.json({ success: false, message: 'Bạn không trong nhóm này' });

            const response = await todoModel.findOneAndUpdate({ _id: noteId, groupId, "todoList._id": todoId }, { $set: { "todoList.$.state": state } }, { new: true });


            // const response = await todoModel.findOne({ _id: noteId });
            // console.log(response);

            return res.json({ success: true, message: 'successfully', response });

        } catch (err) {
            console.log(err);

            return res.json({ success: false, message: 'internal server' });
        }
    }

    /** [DELETE] /api/todos/delete 
     *  Delete a todo
     *  public (logged)
    */
    async delete(req, res) {
        const { data, userId, groupId } = req.body;
        // console.log(`[req body]`, req.body);
        if (!data) return req.status(404).json({ success: false, message: 'bad request' });
        try {

            // Is user in group
            const isUserInGroup = await groupModel
                .exists(
                    {
                        _id: groupId,
                        $or: [{ type: params.DEMO_GROUP_TYPE }, { users: userId }]
                    },
                );

            if (!isUserInGroup) return res.json({ success: false, message: 'Bạn không trong nhóm này' });


            await todoModel.deleteOne({ _id: data, groupId });
            return res.json({ success: true, message: 'successfully', response: data });
        } catch (err) {
            return res.status(500).json({ success: false, message: 'internal server' });
        }
    }

    /**
     * [POST] /api/todos/deleteMulti
     * @param {Object} req {groupId, userId, noteList}
     * @param {*} res 
     */
    async deleteMulti(req, res) {
        const { groupId, userId, noteList } = req.body;

        if (!groupId || !noteList) return res.json({ success: false, message: 'bad request' });
        try {
            const isUserInGroup = await groupModel
                .exists(
                    {
                        _id: groupId,
                        $or: [{ type: params.DEMO_GROUP_TYPE }, { users: userId }]
                    },
                );

            if (!isUserInGroup) return res.json({ success: false, message: 'Bạn không trong nhóm này' });

            await todoModel.deleteMany({ _id: { $in: noteList } });
            return res.json({ success: true, message: 'successfully' });
        } catch (err) {
            console.log(err);
            return res.json({ success: false, message: 'internal server' });
        }
    }

    /**
     * [DELETE] /api/todos/deleteTodo
     * @param {*} req {userId, noteId, todoId, groupId}
     * @param {*} res 
     */
    async deleteTodo(req, res) {
        const { userId, noteId, todoId, groupId } = req.body;
        console.log(req.body);

        if (!noteId || !groupId || !todoId) return res.json({ success: false, message: 'bad request' })

        try {

            const isUserInGroup = await groupModel
                .exists(
                    {
                        _id: groupId,
                        $or: [{ type: params.DEMO_GROUP_TYPE }, { users: userId }]
                    },
                );
            if (!isUserInGroup) return res.json({ success: false, message: 'Bạn không trong nhóm này' });

            const response = await todoModel.findOneAndUpdate({ _id: noteId, groupId }, { $pull: { todoList: { _id: todoId } } });

            return res.json({ success: true, message: 'successfully', response });


        } catch (err) {
            console.log('todo delete todo err', err);
            return res.json({ success: false, message: 'internal server' });
        }
    }

    /**
     * [POST] /api/todos/search
     * @param {Object*} req //search, groupId, userId
     * @param {*} res 
     */
    async search(req, res) {
        const { search = undefined, userId, groupId } = req.body;
        if (search === undefined || !groupId) return res.json({ success: false, message: 'bad request' });

        try {
            const response = await todoModel.aggregate([
                { $lookup: { from: 'groups', localField: "groupId", foreignField: "_id", as: "groupId" } },
                {
                    $match: {
                        title: { $regex: search, $options: 'i' },
                        // "groupId.users": userId, 
                        $or: [{ "groupId.users": userId }, { "groupId.type": "demo" }],
                        "groupId._id": mongoose.Types.ObjectId(groupId)
                    }
                },
                // { $project: { "groupId.users": 0 } }
            ])

            return res.json({ success: true, message: 'successfully', response });

        } catch (err) {
            console.log(err);
            return res.json({ success: false, message: 'internal server' });
        }


    }
}

module.exports = new TodoController;