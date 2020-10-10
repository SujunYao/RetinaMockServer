import express from 'express';
import APIs from './APIs';

const PRODUCT_URL = 'http://localhost:3000';
const USER_SYS_URL = 'http://localhost:4000';

const APP = express();

// LOGIN/LOGOUT
APP.post('/api/login', (req, res) => APIs.user.login(req, res));
APP.post('/api/user', (req, res) => APIs.user.login(req, res, true));
APP.post('/api/logout', (req, res) => APIs.user.logout(req, res));

// COMMON APIS
APP.get('/api/push_len', (req, res) => APIs.push.getPushLen(req, res));

// PRODUCT APIS
APP.post('/api/records', (req, res) => APIs.record.getRecords(req, res));

// SYS APIS
APP.post('/api/admin/system_orgs', (req, res) => APIs.org.getOrgsTreeByUser(req, res));

export default APP;
