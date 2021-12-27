const documentModel = require('../models/document');
const gameModel = require('../models/games');
const mongoose = require('mongoose');

class HomeController {
    async index(req, res) {
        return res.json({ success: true, message: 'successfully' });
    }


    /**
     * [GET] /change
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    async change(req, res) {

        try {
            const db = mongoose.connection.db;
            db.collection('games').rename('game2s');
            return res.json({ success: true, message: 'successfully' });
        } catch (err) {
            console.log(err);
            return res.json({ success: false, message: 'internal server' });
        }
    }
}

module.exports = new HomeController;