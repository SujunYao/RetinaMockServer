import express from 'express';
import APP from './app';
import { generateAllData, clearSYS } from './MockData/generateData';

// const APP = express();

APP.use('/Files', express.static('Files'));
clearSYS();
generateAllData();
// app.use('/static', express.static(path.join(__dirname, 'public')))
APP.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});
APP.set('port', 4600);

APP.listen(APP.get('port'), () => console.info(`App is running at http://localhost:${APP.get('port')} in ${APP.get('env')} mode`));

export default APP;