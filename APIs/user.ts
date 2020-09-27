import fs from 'fs';
import path from 'path';
import { Response, Request, urlencoded } from "express";
import { USER_DATA, ORG_DATA, USER_RES } from '../interfaces';
import { TARGERT_SERVER_HOSTS, ROLE } from '../enum';
import sys from './sys';

import { LOGIN_STATE, AUTHOR_PREFIX } from '../enum';
import org from './org';


const SYS = path.join(__dirname, '../MockData/sys.json');
const USERS = path.join(__dirname, '../MockData/users.json');
const PRODUCT_INFO = path.join(__dirname, '../MockData/RawMaterials/productInfo.json');
const ORGS = path.join(__dirname, '../MockData/orgs.json');

export default {
  login: (req: Request, res: Response, isUserAPI: boolean = false) => {
    const orgs = JSON.parse(fs.readFileSync(ORGS, 'utf8'));
    const productInfo = JSON.parse(fs.readFileSync(PRODUCT_INFO, 'utf8'));
    const sysData = JSON.parse(fs.readFileSync(SYS, 'utf8'));
    let str = '';
    const userInfo = sys.analyticalAuthorization(req);
    req.on('data', (chunk) => { str += chunk; });
    req.on('end', () => {
      const reqData = JSON.parse(str);
      const { lang } = reqData;
      res.statusCode = userInfo ? 200 : 500;
      let token: string | undefined = '';
      let org_name = '';
      let tokenInfo;
      let tgtOrg;
      // let tgtOrg:ORG_DATA;

      if (userInfo) {
        [tgtOrg] = orgs.filter((org: ORG_DATA) => org.id === userInfo.orgID);
        tokenInfo = (userInfo.token && sysData.TOKENS[userInfo.id]) || sys.getToken(userInfo.id);
        console.log(tokenInfo);
        token = tokenInfo?.token;
        org_name = tgtOrg?.name || '';
      }

      delete userInfo.appMode;
      res.statusCode = tokenInfo ? 200 : 403;
      const userRes: USER_RES = {
        AI_type: userInfo.appMode || '',
        id: userInfo.id,
        is_actived: true,
        name: userInfo.name,
        username: userInfo.userName,
        role: userInfo.role || ROLE.DR,
        permission: userInfo.permission,
        org: {
          id: tgtOrg && tgtOrg.id || '',
          name: tgtOrg && tgtOrg.name || '',
        } || org_name || '',
        product_info: (userInfo && productInfo) || [],
        token: token || '',
        target_server_host: TARGERT_SERVER_HOSTS.SYS,
        config: userInfo.config,
        // transfer_config:userInfo.tr
      }
      // delete userInfo.orgID;
      // console.log(sysData);
      // fs.writeFile(SYS, JSON.stringify({
      //   TOKENS: {
      //     ...sysData.TOKENS,
      //     [userInfo.id]: tokenInfo
      //   }, LANG: lang, LOGIN_USER: userInfo.id || '',
      // }), (err) => {
      //   if (err) return console.error(err);
      //   return console.info(`Has generated mock data into ${SYS}`);
      // });
      res.json({
        ...userRes || {},
        status: res.statusCode,
        error_message: !userInfo && 'Could not found the user in the fack data("user.json")',
      });
    });
  },

};