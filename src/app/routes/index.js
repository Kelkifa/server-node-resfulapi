const homeRouter = require('./home');
const gameRouter = require('./game');

function router(app) {
    app.use('/', homeRouter);
    app.use('/api/games', gameRouter);
}

module.exports = router;