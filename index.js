const express = require('express');
const app = express();
const port = process.env.PORT || 8080;


// Prevent ddos
const rateLimit = require('express-rate-limit');
const requrestLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 5 minutes
    max: 1000
});
// app.use(requrestLimit);

/** Models */
//connect db
const db = require('./src/cores/connectDb');
db.connect();

// ** MIDDLEWARE ** //
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/** cors */
// --> Add this
const cors = require('cors');
const whitelist = ['http://localhost:3000', 'http://localhost:8080', 'http://localhost:8080/', 'http://127.0.0.1:8080/', 'https://thuongvachon.web.app'];
const corsOptions = {
    origin: function (origin, callback) {
        console.log("** Origin of request " + origin)
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            console.log("Origin acceptable")
            callback(null, true)
        } else {
            console.log("Origin rejected")
            callback(new Error('Not allowed by CORS'))
        }
    }
}
app.use(cors());
app.use(cors(corsOptions));

// Render
const router = require('./src/app/routes');
router(app);

app.listen(port, () => {
    console.log(`Web at localhost:${port}`);
});