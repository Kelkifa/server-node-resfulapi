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
}

module.exports = new GameController;