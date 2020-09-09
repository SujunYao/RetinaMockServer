import fs from 'fs';
import path from 'path';
import { Response, Request, urlencoded } from "express";
import { USER_DATA, ORG_DATA } from '../interfaces';
import { getToken } from './sys';

const SYS = path.join(__dirname, '../MockData/sys.json');
const USERS = path.join(__dirname, '../MockData/users.json');
const PRODUCT_INFO = path.join(__dirname, '../MockData/productInfo.json');
const ORGS = path.join(__dirname, '../MockData/orgs.json');

export default {
  login: (req: Request, res: Response) => {
    const users = JSON.parse(fs.readFileSync(USERS, 'utf8'));
    const orgs = JSON.parse(fs.readFileSync(ORGS, 'utf8'));
    const productInfo = JSON.parse(fs.readFileSync(PRODUCT_INFO, 'utf8'));
    let str = '';
    req.on('data', (chunk) => { str += chunk; });
    req.on('end', () => {
      const reqData = JSON.parse(str);
      const { password, username, lang } = reqData;
      const [loginUser]: Array<USER_DATA> = users.filter((user: USER_DATA) => user.password === password && user.userName === username);
      res.statusCode = loginUser ? 200 : 500;
      if (loginUser) {
        const [org]: Array<ORG_DATA> = orgs.filter((org: ORG_DATA) => org.id === loginUser.orgID);
      }
      const token = getToken(loginUser.id);
      res.json({
        ...loginUser || {},
        
        product_info: productInfo || [],
        status: res.statusCode,
        error_message: !loginUser && 'Could not found the user in the fack data("user.json")',
      });
    });
  }
  // login: (req: Request, res: Response) => {
  //   const users = JSON.parse(fs.readFileSync(USER, 'utf8'));
  //   const bgSysInfo = JSON.parse(fs.readFileSync(SYS, 'utf8'));
  //   const productInfo = JSON.parse(fs.readFileSync(PRODUCT_INFO, 'utf8'));
  //   const sites = JSON.parse(fs.readFileSync(SITES, 'utf8'));
  //   let str = '';
  //   req.on('data', (chunk) => { str += chunk; });
  //   req.on('end', () => {
  //     const reqData = JSON.parse(str);
  //     const { password: pw, username: un, lang } = reqData;
  //     const loginUser = users.filter(u => (u.username === un || u.name === un) && u.password === pw)
  //       .slice(-1).pop();
  //     res.statusCode = loginUser ? 200 : 500;
  //     const org = {};
  //     if (loginUser) {
  //       const [orgSite] = sites.filter(site => site.drs.indexOf(loginUser.id) >= 0);
  //       org.id = orgSite.id;
  //       org.name = orgSite.name;
  //     }
  //     fs.writeFileSync(SYS,
  //       JSON.stringify({ ...bgSysInfo, lang, loginUser: loginUser && loginUser.id }),
  //       (err: string) => {
  //         if (err) return console.error(err);
  //         return console.info(`Has update data into ${SYS}`);
  //       });
  //     res.json({
  //       ...loginUser || {},
  //       product_info: productInfo || [],
  //       status: res.statusCode,
  //       error_message: !loginUser && 'Could not found the user in the fack data("user.json")',
  //     });
  //   });
  // },
  // getUserInfo: (req: Request, res: Response) => {
  //   const users = JSON.parse(fs.readFileSync(USER, 'utf8'));
  //   const productInfo = JSON.parse(fs.readFileSync(PRODUCT_INFO, 'utf8'));
  //   const sites = JSON.parse(fs.readFileSync(SITES, 'utf8'));
  //   let str = '';
  //   req.on('data', (chunk) => { str += chunk; });
  //   req.on('end', () => {
  //     const reqData = JSON.parse(str);
  //     const { id } = reqData;
  //     const loginUser = users.filter(u => u.id === id).slice(-1).pop();
  //     res.statusCode = loginUser ? 200 : 500;
  //     const org = {};
  //     if (loginUser) {
  //       const [orgSite] = sites.filter(site => site.drs.indexOf(loginUser.id) >= 0);
  //       org.id = orgSite.id;
  //       org.name = orgSite.name;
  //     }
  //     res.json({
  //       ...loginUser || {},
  //       product_info: productInfo || [],
  //       org,
  //       status: res.statusCode,
  //       error_message: !loginUser && 'Could not found the user in the fack data("user.json")',
  //     });
  //   });
  // },
};

// export default user;
