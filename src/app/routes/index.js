const homeRouter = require('./home');
const gameRouter = require('./game');
const todoRouter = require('./todo');
const docRouter = require('./doc');
const authRouter = require('./auth');
const groupRouter = require('./group');
const paperRouter = require('./paper');
const getUserInfoMidleware = require('../../midlewares/getUserInfoMidleware');

function router(app) {
    app.use('/api/docs', getUserInfoMidleware, docRouter);
    app.use('/api/games', gameRouter);
    app.use('/api/todos', getUserInfoMidleware, todoRouter);
    app.use('/api/groups', getUserInfoMidleware, groupRouter);
    app.use('/api/papers', getUserInfoMidleware, paperRouter);

    app.use('/api/auth', authRouter);

    app.use('/', homeRouter);

}

module.exports = router;