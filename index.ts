import express from 'express';
import APP from './app';

// const APP = express();

APP.use(express.static('files'))
// app.use('/static', express.static(path.join(__dirname, 'public')))

APP.set('port', 4600);

APP.listen(APP.get('port'), () => console.info(`App is running at http://localhost:${APP.get('port')} in ${APP.get('env')} mode`));

export default APP;