import express from 'express';
import APP from './app';
import { generateAllData } from './MockData/generateData';

// const APP = express();

APP.use('/Files', express.static('Files'));
generateAllData();
// app.use('/static', express.static(path.join(__dirname, 'public')))

APP.set('port', 4600);

APP.listen(APP.get('port'), () => console.info(`App is running at http://localhost:${APP.get('port')} in ${APP.get('env')} mode`));

export default APP;