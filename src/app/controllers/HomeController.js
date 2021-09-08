const documentModel = require('../models/document');
const gameModel = require('../models/games');

class HomeController {
    async index(req, res) {
        return res.json({ success: true, message: 'successfully' });
    }

    /** [GET] /home/createCollection 
     *  Create a new collection in mongodb
     *  public
    */
    async createCollection(req, res) {
        try {
            const response = await gameModel.find().sort({ createdAt: 'desc' });
            console.log(response);
            return res.json({ success: true, message: response });
        } catch (err) {
            console.log(err);
            return res.json({ success: false, message: 'fail' });
        }
    }
}

module.exports = new HomeController;