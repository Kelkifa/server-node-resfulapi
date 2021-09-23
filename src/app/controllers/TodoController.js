const todoModel = require('../models/todos');

class NoteController {
    /** [GET] /api/notes/get 
     *  Get all note of user
     *  Public (logged)
    */
    async get(req, res) {
        try {
            const response = await todoModel.find({});
            console.log(`[note list]`, response);
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
        console.log('[data]', data);
        const newTodo = await todoModel.create(data);
        console.log('[newTodo]', newTodo);

        return res.json({ success: true, message: 'succesfully', response: newTodo });
    }
    /** [DELETE] /api/todos/delete 
     *  Delete all todo list
     *  dev
    */
    async delete(req, res) {
        try {
            await todoModel.deleteMany({});
            return res.json({ success: true, message: 'successfully' });
        } catch (err) {
            return res.status(500).json({ success: false, message: 'internal server' });
        }
    }
}

module.exports = new NoteController;