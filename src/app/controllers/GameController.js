const gameModel = require('../models/games')


class GameController {

    /** [GET] /api/games/clientGet
     *  Client get all games
     *  public
    */
    async clientGet(req, res) {
        try {
            const response = await gameModel.find({});
            return res.json({ success: true, message: 'successfully', response });
        } catch (err) {
            console.log(err);
            return res.status(500).json({ success: false, message: 'internal server' });
        }
    }


    /** [GET] /api/games/adminGet
     *  Admin get all games
     *  Private
    */
    async adminGet(req, res) {
        try {
            const [listResponse, trashResponse] = await Promise.all([
                gameModel.find({}),
                gameModel.findDeleted({})
            ]);
            return res.json({ success: true, message: 'successfully', listResponse, trashResponse });
        } catch (err) {
            console.log(err);
            return res.status(500).json({ success: false, message: 'internal server' });
        }
    }

    /** [PATCH] /api/games/delete
     *  Admin sort delete games
     *  Private
    */
    async softDelete(req, res) {
        const { data = [] } = req.body;
        if (!data.length) return res.state(404).json({ success: false, message: 'bad request' })
        try {
            await gameModel.delete({ _id: { $in: data } });
            return res.json({ success: true, message: 'successfully', response: data });
        } catch (err) {
            console.log(err);
            return res.status(500).json({ success: false, message: 'internal server' });
        }
    }

    /** [PATCH] /api/games/restore
     *  Admin restore delete games
     *  Private
    */
    async restore(req, res) {
        const { data } = req.body;
        if (!data.length) return res.state(404).json({ success: false, message: 'bad request' })
        try {
            await gameModel.restore({ _id: { $in: data } });
            return res.json({ success: true, message: 'successfully', response: data });
        } catch (err) {
            console.log(err);
            return res.status(500).json({ success: false, message: 'internal server' });
        }
    }
}

module.exports = new GameController;