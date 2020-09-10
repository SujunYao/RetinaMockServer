import fs from 'fs';
import path from 'path';
import { Response, Request, urlencoded } from "express";
import { USER_DATA, ORG_DATA } from '../interfaces';
import sys from './sys';

import { LOGIN_STATE, AUTHOR_PREFIX } from '../enum';


const SYS = path.join(__dirname, '../MockData/sys.json');
const USERS = path.join(__dirname, '../MockData/users.json');
const PRODUCT_INFO = path.join(__dirname, '../MockData/RawMaterials/productInfo.json');
const ORGS = path.join(__dirname, '../MockData/orgs.json');

export default {
  login: (req: Request, res: Response) => {
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

      if (userInfo) {
        const [org]: Array<ORG_DATA> = orgs.filter((org: ORG_DATA) => org.id === userInfo.orgID);
        tokenInfo = (userInfo.token && sysData.TOKENS[userInfo.id]) || sys.getToken(userInfo.id);
        token = tokenInfo.token;
        org_name = org?.name || '';
      }

      const AI_type = userInfo.appMode;
      delete userInfo.appMode;
      // delete userInfo.orgID;
      console.log(sysData);
      fs.writeFile(SYS, JSON.stringify({
        TOKENS: {
          ...sysData.TOKENS,
          [userInfo.id]: tokenInfo
        }, LANG: lang, LOGIN_USER: userInfo.id || ''
      }), (err) => {
        if (err) return console.error(err);
        return console.info(`Has generated mock data into ${SYS}`);
      });
      res.json({
        ...userInfo || {},
        org_name,
        AI_type,
        product_info: (userInfo && productInfo) || [],
        token,
        status: res.statusCode,
        error_message: !userInfo && 'Could not found the user in the fack data("user.json")',
      });
    });
  },
};