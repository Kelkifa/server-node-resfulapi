const homeRouter = require('./home');
const gameRouter = require('./game');

function router(app) {
    app.use('/api/games', gameRouter);
    app.use('/', homeRouter);
}

module.exports = router;