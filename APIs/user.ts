import fs from 'fs';
import path from 'path';
import { Response, Request, urlencoded } from "express";
import * as csv from 'fast-csv';
import { parse, parseFile } from '@fast-csv/parse';
import { USER_DATA, ORG_DATA, USER_RES, SYS_DATA, USER_DATA_RES } from '../interfaces';
import { TARGERT_SERVER_HOSTS, ROLE, LOGIN_STATE, AUTHOR_PREFIX } from '../enum';
import sys from './sys';
import org from './org';


const SYS = path.resolve(__dirname, '../MockData', 'sys.csv');
// const USERS = path.join(__dirname, '../MockData/users.json');
const USERS = path.resolve(__dirname, '../MockData', 'users.csv');
const PRODUCT_INFO = path.join(__dirname, '../MockData/RawMaterials/productInfo.json');
const ORGS = path.join(__dirname, '../MockData/orgs.json');

export default {
  login: (req: Request, res: Response, isUserAPI: boolean = false) => {
    // const orgs = JSON.parse(fs.readFileSync(ORGS, 'utf8'));
    const productInfo = JSON.parse(fs.readFileSync(PRODUCT_INFO, 'utf8'));
    // const sysData = JSON.parse(fs.readFileSync(SYS, 'utf8'));
    let str = '';
    const { val1, val2 } = sys.analyticalAuthorization(req);
    req.on('data', (chunk) => { str += chunk; });
    req.on('end', () => {
      const tgtToken: Array<SYS_DATA> = [];
      parseFile(SYS, { headers: true })
        // .pipe(csv.parse({ headers: true }))
        .on('data', row => {
          if (row.TOKENID === val1) {
            tgtToken.push(row);
          }
        })
        .on('end', () => {
          let userID: string = '';
          if (tgtToken.length > 0) {
            [{ LOGIN_USER_ID: userID }] = tgtToken;
          }
          const tgtUser: Array<USER_DATA> = [];
          const a = parseFile(USERS, { headers: true })
            // .pipe(csv.parse({ headers: true }))
            // .pipe(csv.format<USER_DATA, USER_DATA_RES>({ headers: true }))
            // .transform((row, next): void => {
            //   return next(null, {
            //     AI_type: row.appMode || '',
            //     id: row.id,
            //     password: row.password,
            //     is_actived: true,
            //     name: row.name,
            //     username: row.userName,
            //     role: row.role || ROLE.DR,
            //     org: {
            //       id: row.orgID || '',
            //       name: '',
            //     },
            //     product_info: productInfo,
            //     token: '',
            //     config: {},
            //     permission: {},
            //     target_server_host: TARGERT_SERVER_HOSTS.SYS,
            //   });
            // })
            .on('data', row => {
              if ((userID && row.id === userID) || (row.userName === val1 && row.password === val2)) {
                tgtUser.push(row);
              }
            })
            .on('end', () => {
              const statusCode = tgtUser.length > 0 && 200 || 500;
              res.statusCode = statusCode;
              res.json({
                ...tgtUser[0] || {},
                // AI_type: 
                status: statusCode,
                error_message: tgtUser.length <= 0 && 'Could not found the user in the fack data("user.json")',
              });
              // if(tgtUser.length>0){

              // }
            })
          console.log(a);
        });
      //   console.log(str);
      //   if (str) {
      //     const reqData = JSON.parse(str);
      //     const { lang } = reqData;
      //   }
      //   res.statusCode = userInfo ? 200 : 500;
      //   let token: string | undefined = '';
      //   let org_name = '';
      //   let tokenInfo;
      //   let tgtOrg;
      //   // let tgtOrg:ORG_DATA;

      //   if (userInfo) {
      //     [tgtOrg] = orgs.filter((org: ORG_DATA) => org.id === userInfo.orgID);
      //     tokenInfo = (userInfo.token && sysData.TOKENS[userInfo.id]) || sys.getToken(userInfo.id);
      //     console.log(tokenInfo);
      //     token = tokenInfo?.token;
      //     org_name = tgtOrg?.name || '';
      //   }

      //   delete userInfo.appMode;
      //   res.statusCode = tokenInfo ? 200 : 403;
      // const userRes: USER_RES = {
      //   AI_type: userInfo.appMode || '',
      //   id: userInfo.id,
      //   is_actived: true,
      //   name: userInfo.name,
      //   username: userInfo.userName,
      //   role: userInfo.role || ROLE.DR,
      //   // permission: userInfo.permission,
      //   org: {
      //     id: tgtOrg && tgtOrg.id || '',
      //     name: tgtOrg && tgtOrg.name || '',
      //   } || org_name || '',
      //   product_info: (userInfo && productInfo) || [],
      //   token: token || '',
      //   target_server_host: TARGERT_SERVER_HOSTS.SYS,
      //   // config: userInfo.config,
      //   // transfer_config:userInfo.tr
      // }
      //   // delete userInfo.orgID;
      //   // console.log(sysData);
      //   // fs.writeFile(SYS, JSON.stringify({
      //   //   TOKENS: {
      //   //     ...sysData.TOKENS,
      //   //     [userInfo.id]: tokenInfo
      //   //   }, LANG: lang, LOGIN_USER: userInfo.id || '',
      //   // }), (err) => {
      //   //   if (err) return console.error(err);
      //   //   return console.info(`Has generated mock data into ${SYS}`);
      //   // });
      //   res.json({
      //     ...userRes || {},
      //     status: res.statusCode,
      //     error_message: !userInfo && 'Could not found the user in the fack data("user.json")',
      //   });
    });
  },

  logout: async (req: Request, res: Response) => {
    // const orgs = JSON.parse(fs.readFileSync(ORGS, 'utf8'));
    // const productInfo = JSON.parse(fs.readFileSync(PRODUCT_INFO, 'utf8'));
    const sysData = JSON.parse(fs.readFileSync(SYS, 'utf8'));
    let str = '';
    // const  userInfo = await csv.parseFile(USERS);
    // console.log(user);

    // const userInfo = await sys.analyticalAuthorization(req);
    req.on('data', (chunk) => { str += chunk; });
    // req.on('end', () => {
    //   let error_message = '';
    //   res.statusCode = userInfo ? 200 : 500;
    //   if (userInfo && userInfo.token) {
    //     sys.clearToken(userInfo.token);
    //   } else {
    //     error_message = 'The provide token is not found in the system store!';
    //   }
    //   res.json({
    //     status: res.statusCode,
    //     error_message,
    //   });
    // });
  },

  // readUser: (params: { userID?: string, un?: string, pw?: string }) => {
  //   new Promise((res, rej) => {
  //     const tgtUser: Array<USER_DATA> = [];
  //     fs.createReadStream(USERS)
  //       .pipe(csv.parse({ headers: true }))
  //       .on('error', error => rej(error))
  //       .on('data', row => {
  //         if ((params.userID && row.id === params.userID)
  //           || (params.un && params.pw && row.userName === params.un && row.password === params.pw)) {
  //           tgtUser.push(row);
  //         }
  //       })
  //       .on('end', (rowCount: number) => res(tgtUser));
  //     // fs.createReadStream(USERS)
  //     //   .pipe(csv.parse({ headers: true }))
  //     //   // .on('error', error => rej(error))
  //     //   .on('data', row => console.log(row))
  //     //   // .on('data', row => {
  //     //   //   if ((params.userID && row.id === params.userID)
  //     //   //     || (params.un && params.pw && row.userName === params.un && row.password === params.pw)) {
  //     //   //     tgtUser.push(row);
  //     //   //   }
  //     //   // })
  //     //   .end('end', () => {
  //     //     // res(tgtUser);
  //     //     process.exit();
  //     //   });
  //   });
  // },

  wechat_mobile: (req: Request, res: Response) => {

    // let str = '';
    // req.on('data', (chunk) => { str += chunk; });
    // req.on('end', () => {
    //   const reqData = JSON.parse(str);
    //   const request = new XMLHttpRequest();
    //   request.setRequestHeader('Content-Type', 'application/json');
    //   request.setRequestHeader('Accept', 'application/json');
    //   request.setRequestHeader('Authorization', req.header('Authorization') || '');
    //   request.onreadystatechange = function () {
    //     if (this.readyState == 4) {
    //       if (this.status == 200) {
    //         const resData = ;
    //         res.json(JSON.parse(this.responseText));
    //       } else {
    //         throw new Error(`${this.status}: ${JSON.parse(this.responseText).error_message}`);
    //       }
    //     }
    //   };
    //   request.open('POST', '/api/wechat_mobile', true);
    //   request.send(JSON.stringify(reqData));
    // });

    res.json({
      status: res.statusCode,
      error_message: '',
      patient_status: 1,
      pwd_status: 0,
      openid: 'oEj1Gvy5qSM7GUNdc7fzU2_HfK68'
    });
  }

};