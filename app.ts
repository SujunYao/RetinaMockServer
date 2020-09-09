import express from 'express';
import APIs from './APIs';

const APP = express();

APP.post('/api/login', (req, res) => APIs.user.login(req, res));
// APP.get('/api/user', (req, res) => APIs.user.getUser(req, res));

export default APP;