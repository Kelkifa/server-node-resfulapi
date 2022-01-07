require('dotenv').config();
const mongoose = require('mongoose');
//Change it
const mongodbUrl = process.env.MONGODB_URL;

async function connect() {
    try {
        await mongoose.connect(mongodbUrl || 'mongodb://localhost/banhang', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        // Rename the `test` collection to `foobar`
        console.log('Connect successfully');

    } catch (err) {
        console.log("Fail to connect to db: " + err)
    }
}

module.exports = { connect }