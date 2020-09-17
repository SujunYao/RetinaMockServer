import express from 'express';
import APIs from './APIs';

const PRODUCT_URL = 'http://localhost:3000';
const USER_SYS_URL = 'http://localhost:4000';

const APP = express();

APP.post('/api/login', (req, res) => APIs.user.login(req, res));
APP.post('/api/user', (req, res) => APIs.user.login(req, res));
APP.post('/api/records', (req, res) => APIs.record.getRecords(req, res))

export default APP;