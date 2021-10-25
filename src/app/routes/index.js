const homeRouter = require('./home');
const gameRouter = require('./game');
const todoRouter = require('./todo');
const docRouter = require('./doc');
const authRouter = require('./auth');

function router(app) {
    app.use('/api/docs', docRouter);
    app.use('/api/games', gameRouter);
    app.use('/api/todos', todoRouter);

    app.use('/api/auth', authRouter);

    app.use('/', homeRouter);

}

module.exports = router;