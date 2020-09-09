import fs from 'fs';
import path from 'path';
import { guid } from '../MockData/utils';
import { Response, Request } from "express";
import { USER_DATA } from '../interfaces';

interface TOKEN {
  createDate: Date,
  userID: string,
  token: string,
}

const SYS = path.join(__dirname, '../MockData/sys.json');
const USERS = path.join(__dirname, '../MockData/users.json');
const outTime: number = 0.5; // TOKEN 超时 
export default {
  getToken: (userID: string): TOKEN | undefined => {
    const users = JSON.parse(fs.readFileSync(USERS, 'utf8'));
    const sys = JSON.parse(fs.readFileSync(SYS, 'utf8'));
    const curDate: Date = new Date();
    if (users.filter((user: USER_DATA) => user.id === userID).length > 0) {
      if (!sys.TOKENS[userID]) {
        sys.TOKENS[userID] = {
          createDate: curDate,
          userID: userID,
          token: guid(32)
        }
      } else {
        const cTime = sys.TOKENS[userID].createDate.getTime();
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
      const cTime = sys.TOKENS[userID].createDate.getTime();
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
  }
}