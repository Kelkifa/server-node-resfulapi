class DocController {
    get(req, res) {


        return res.json({ success: true, message: 'successfully' });
    }

}

module.exports = new DocController;