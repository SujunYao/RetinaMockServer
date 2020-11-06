import express from 'express';
import APIs from './APIs';

const PRODUCT_URL = 'http://localhost:3000';
const USER_SYS_URL = 'http://localhost:4000';

const APP = express();

const backednServerURL = 'http://retina.voxelcloud.net.cn';

APP.all('*', function (req, res, next) {
  // console.log(req.headers.origin);
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Method', 'GET,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'access-control-allow-headers,access-control-allow-methods,Accept,Content-Type,x-requested-with,authorization,Origin');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '100');
  next();
});

APP.options('*', function (req, res) {
  console.log(req.headers.origin);
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Method', 'GET,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'access-control-allow-headers,access-control-allow-methods,Accept,Content-Type,x-requested-with,authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '100');
  res.statusCode = 200;
  res.end('ok');
});

// APP.post('/api/wechat_mobile', (req, res) =>{ res.header("Origin", 'http://localhost:19006'); res.redirect(307, `${backednServerURL}/api/wechat_mobile`);});
// APP.post('/api/wechat_mobile', (req, res) => res.redirect(307, `${backednServerURL}/api/wechat_mobile`));
// APP.post('/api/wechat_bind', (req, res) => res.redirect(307, `${backednServerURL}/api/wechat_bind`));
// APP.post('/api/verify_code', (req, res) => res.redirect(307, `${backednServerURL}/api/verify_code`));
// APP.post('/api/patient_pwd', (req, res) => res.redirect(307, `${backednServerURL}/api/patient_pwd`));
// APP.post('/api/wechat_pid', (req, res) => res.redirect(307, `${backednServerURL}/api/wechat_pid`));
// APP.post('/api/wechat_report', (req, res) => res.redirect(307, `${backednServerURL}/api/wechat_report`));
// APP.post('/api/wechat_unbind', (req, res) => res.redirect(307, `${backednServerURL}/api/wechat_unbind`));
// APP.post('/api/transfer_org', (req, res) => APIs.record.transfer_org(req, res));
// APP.post('/api/scope', (req, res) => res.redirect(307, `${backednServerURL}/api/scope`))
// APP.post('/api/report_validation', (req, res) => res.redirect(307, `${backednServerURL}/api/report_validation`))
// APP.post('/api/health_record', (req, res) => {
//   // res.header("Origin", 'http://192.168.1.8');
//   console.log(req.headers.origin);
//   res.header("Origin", 'http://localhost:19006');
//   res.redirect(307, `${backednServerURL}/api/health_record`);
// });
// APP.get('/api/health_record', (req, res) => {
//   const _pid = req.param('pid');
//   res.redirect(307, `${backednServerURL}/api/health_record?pid=${_pid}`);
// });
// APP.get('/api/wechat_last_exam', (req, res) => {
//   const _pid = req.param('pid');
//   res.redirect(307, `${backednServerURL}/api/wechat_last_exam?pid=${_pid}`);
// });
// APP.get('/api/wechat_records', (req, res) => {
//   const _pid = req.param('pid');
//   res.redirect(307, `${backednServerURL}/api/wechat_records?pid=${_pid}`);
// });
// APP.get('/api/transfer_reserve', (req, res) => {
//   const _id = req.param('id');
//   res.redirect(307, `${backednServerURL}/api/transfer_reserve?id=${_id}`);
// });


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

// WECHAT APIS
// APP.options('/api/wechat_mobile', ());
// APP.options('/api/wechat_mobile', (req, res) => APIs.user.options(req, res));
APP.post('/api/wechat_mobile', (req, res) => APIs.user.wechat_mobile(req, res));
APP.post('/api/send_auth', (req, res) => APIs.sys.send_auth(req, res));
APP.post('/api/verify_code', (req, res) => APIs.sys.verify_code(req, res));
APP.post('/api/wechat_bind', (req, res) => APIs.sys.wechat_bind(req, res));
APP.post('/api/patient_pwd', (req, res) => APIs.user.patient_pwd(req, res));
APP.get('/api/health_record', (req, res)=> APIs.user.health_record(req, res));
APP.post('/api/health_record', (req, res)=> APIs.user.update_health_record(req, res));
APP.get('/api/wechat_last_exam', (req, res)=>APIs.record.getLastExam(req, res));
APP.get('/api/get_reserve', (req, res)=> APIs.record.getReserve(req, res));
APP.post('/api/scope', (req, res)=>APIs.record.getScope(req, res));
APP.get('/api/wechat_records', (req, res)=>APIs.record.getWechatRecords(req, res));
APP.post('/api/wechat_pid', (req, res)=>APIs.user.getPID(req, res));
APP.post('/api/transfer_org', (req, res)=> APIs.org.getORGInfo(req, res));
APP.post('/api/transfer_reserve', (req, res)=>APIs.record.udpateAPPT(req, res));
APP.delete('/api/transfer_reserve', (req, res)=>APIs.record.deleteAPPT(req, res));
APP.post('/api/wechat_report', (req, res)=>APIs.record.getRPT(req,res));
APP.post('/api/wechat_unbind', (req, res)=>APIs.user.logout(req, res));
export default APP;
