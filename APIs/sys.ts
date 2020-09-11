import fs from 'fs';
import path from 'path';
import { guid } from '../MockData/utils';
import { Response, Request } from "express";
import { USER_DATA } from '../interfaces';
import { LOGIN_STATE, AUTHOR_PREFIX } from '../enum';

interface TOKEN {
  createDate: Date,
  userID: string,
  token: string, 
}

const SYS = path.join(__dirname, '../MockData/sys.json');
const USERS = path.join(__dirname, '../MockData/users.json');
const outTime: number = 0.5; // TOKEN 超时 
export default {
  getToken: (userID: string, noNeedCreate: boolean = false): TOKEN | undefined => {
    const users = JSON.parse(fs.readFileSync(USERS, 'utf8'));
    const sys = JSON.parse(fs.readFileSync(SYS, 'utf8'));
    const curDate: Date = new Date();
    if (users.filter((user: USER_DATA) => user.id === userID).length > 0) {
      if (!sys.TOKENS[userID]) {
        if (!noNeedCreate) {
          sys.TOKENS[userID] = {
            createDate: curDate,
            userID: userID,
            token: guid(32)
          }
        }
      } else {
        const cTime = new Date(sys.TOKENS[userID].createDate).getTime();
        const curTime = curDate.getTime();
        if ((curTime - cTime) / (1000 * 60 * 60) > outTime) {
          delete sys.TOKENS[userID];
        }
      }
    }
    fs.writeFile(SYS, JSON.stringify(sys), (err) => {
      if (err) return console.error(err);
      return console.info(`Has generated mock data into ${SYS}`);
    });
    return sys.TOKENS[userID];
  },

  checkToken: (tokenKey: string) => {
    const sys = JSON.parse(fs.readFileSync(SYS, 'utf8'));
    const curDate = new Date();
    const [userID] = Object.keys(sys.TOKENS).filter((key: string) => key === tokenKey);
    if (userID) {
      const cTime = new Date(sys.TOKENS[userID].createDate).getTime();
      const curTime = curDate.getTime();
      if ((curTime - cTime) / (1000 * 60 * 60) > outTime) {
        delete sys.TOKENS[userID];
      }
    }
    fs.writeFile(SYS, JSON.stringify(sys), (err) => {
      if (err) return console.error(err);
      return console.info(`Has generated mock data into ${SYS}`);
    });
    return sys.TOKENS[userID];
  },

  checkUserState: (userID: string) => {
    const sys = JSON.parse(fs.readFileSync(SYS, 'utf8'));
    const userToken = sys.TOKENS[userID];
    const curDate: Date = new Date();
    if (userToken) {
      const cTime = new Date(userToken.createDate).getTime();
      const curTime = curDate.getTime();
      if ((curTime - cTime) / (1000 * 60 * 60) > outTime) {
        return {
          userID,
          state: LOGIN_STATE.LOGIN
        }
      }
      return {
        userID,
        state: LOGIN_STATE.TOKEN_EXPRIED
      }
    }
    return {
      userID,
      state: LOGIN_STATE.LOGOUT
    }
  },

  analyticalAuthorization: (req: Request) => {
    const users = JSON.parse(fs.readFileSync(USERS, 'utf8'));
    const sys: {
      TOKENS: {
        [key: string]: TOKEN
      }
    } = JSON.parse(fs.readFileSync(SYS, 'utf8'));
    const author = req.header('Authorization');
    const [val1, val2]: Array<string> = Buffer.from(author?.split(AUTHOR_PREFIX).slice(-1).pop() || '', 'base64').toString().split(':')
    let userinfo: USER_DATA;
    const [tgtToekn]: Array<TOKEN> = Object.values(sys.TOKENS).filter((token: TOKEN) => token.token === val1);
    if (tgtToekn) {
      [userinfo] = users.filter((user: USER_DATA) => user.id === tgtToekn.userID);
    } else {
      [userinfo] = users.filter((user: USER_DATA) => user.userName === val1 && user.password === val2);
    }
    return { ...userinfo, token: tgtToekn?.token || '' };
  }
}