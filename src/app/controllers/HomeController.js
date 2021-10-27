const documentModel = require('../models/document');
const gameModel = require('../models/games');

class HomeController {
    async index(req, res) {
        return res.json({ success: true, message: 'successfully' });
    }
}

module.exports = new HomeController;