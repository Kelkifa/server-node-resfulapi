const documentModel = require('../models/document');

class HomeController {
    async index(req, res) {
        const response = await documentModel.find();
        // console.log(response);
        return res.json({ success: true, message: 'successfully', response });
    }
}

module.exports = new HomeController;