import fs from 'fs';
import path from 'path';
import * as csv from 'fast-csv';
import { guid } from '../MockData/utils';
import { Response, Request } from "express";
import { USER_DATA, USER_DATA_RES, SYS_DATA, SYS_DATA_RES } from '../interfaces';
import { LOGIN_STATE, AUTHOR_PREFIX, OPERATION_PERMISSIONS } from '../enum';
import user from './user';

interface TOKEN {
  createDate: Date,
  userID: string,
  token: string,
}

interface SYS_INFO {
  TOKENS: {
    [key: string]: TOKEN
  }
}

const SYS = path.resolve(__dirname, '../MockData', 'sys.csv');
const USERS = path.resolve(__dirname, '../MockData', 'users.csv');
// path.join(__dirname, '../MockData/users.json');

const outTime: number = 0.5; // TOKEN 超时 
export default {
  getToken: (userID: string, noNeedCreate: boolean = false) => {
    fs.createReadStream(USERS)
      .pipe(csv.parse({ headers: true }))
      // pipe the parsed input into a csv formatter
      .pipe(
        csv.format<USER_DATA, USER_DATA_RES>({ headers: true }),
      )
      // Using the transform function from the formatting stream
      .transform((row, next): void => {
        if (row.id === userID) {
          console.log(row);
        }
        // User.findById(+row.id, (err, user) => {
        //     if (err) {
        //         return next(err);
        //     }
        //     if (!user) {
        //         return next(new Error(`Unable to find user for ${row.id}`);
        //     }
        //     return next(null, {
        //         id: user.id,
        //         firstName: row.first_name,
        //         lastName: row.last_name,
        //         address: row.address,
        //         // properties from user
        //         isVerified: user.isVerified,
        //         hasLoggedIn: user.hasLoggedIn,
        //         age: user.age,
        //     });
        // });
      })
      .pipe(process.stdout)
      .on('end', () => process.exit());
    // const users = JSON.parse(fs.readFileSync(USERS, 'utf8'));
    // const sys = JSON.parse(fs.readFileSync(SYS, 'utf8'));
    // const curDate: Date = new Date();
    // if (users.filter((user: USER_DATA) => user.id === userID).length > 0) {
    //   if (!sys.TOKENS[userID]) {
    //     if (!noNeedCreate) {
    //       sys.TOKENS[userID] = {
    //         createDate: curDate,
    //         userID: userID,
    //         token: guid(32)
    //       }
    //     }
    //   } else {
    //     const cTime = new Date(sys.TOKENS[userID].createDate).getTime();
    //     const curTime = curDate.getTime();
    //     if ((curTime - cTime) / (1000 * 60 * 60) > outTime) {
    //       delete sys.TOKENS[userID];
    //     }
    //   }
    // }
    // fs.writeFile(SYS, JSON.stringify(sys), (err) => {
    //   if (err) return console.error(err);
    //   return console.info(`Has generated mock data into ${SYS}`);
    // });
    // return sys.TOKENS[userID];
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

  analyticalAuthorization: (req: Request): { val1: string, val2: string } => {
    // const users = JSON.parse(fs.readFileSync(USERS, 'utf8'));
    // const sys: {
    //   TOKENS: {
    //     [key: string]: TOKEN
    //   }
    // } = JSON.parse(fs.readFileSync(SYS, 'utf8'));
    const author = req.header('Authorization');
    const [val1, val2]: Array<string> = Buffer.from(author?.split(AUTHOR_PREFIX).slice(-1).pop() || '', 'base64').toString().split(':')
    return { val1, val2 };
    // let userinfo: USER_DATA;
    // const tgtUser = user.readUser({ un: val1, pw: val2 });
    // console.log(tgtUser);
    // const tgtToken: Array<string> = [];
    // new Promise((reslove, reject) => {
    //   fs.createReadStream(SYS)
    //     .pipe(csv.parse({ headers: true }))
    //     .on('data', row => {
    //       if (row.TOKENID === val1) {
    //         tgtToken.push(row);
    //       }
    //     })
    //     .on('end', () => reslove(tgtToken));
    // });
    // // pipe the parsed input into a csv formatter
    // .pipe(
    //     csv.format<SYS_DATA, SYS_DATA_RES>({ headers: true }),
    // )
    // // Using the transform function from the formatting stream
    // .transform((row, next): void => {
    //   if(row.TOKENID === val1){
    //     return next(null, {
    //       userID: row.LOGIN_USER_ID,
    //       token: row.TOKENID,
    //     });
    //   }else {
    //     return next(new Error(`Unable to find user for ${val1}`));
    //   }
    //     // User.findById(+row.id, (err, user) => {
    //     //     if (err) {
    //     //         return next(err);
    //     //     }
    //     //     if (!user) {
    //     //         return next(new Error(`Unable to find user for ${row.id}`);
    //     //     }
    //     //     return next(null, {
    //     //         id: user.id,
    //     //         firstName: row.first_name,
    //     //         lastName: row.last_name,
    //     //         address: row.address,
    //     //         // properties from user
    //     //         isVerified: user.isVerified,
    //     //         hasLoggedIn: user.hasLoggedIn,
    //     //         age: user.age,
    //     //     });
    //     // });
    // })
    // .pipe(process.stdout)
    // .on('data', (data)=> console.log(data))
    // .on('end', () => process.exit());
    // new Promise((res, rej) => {
    //   fs.createReadStream(USERS)
    //     .pipe(csv.parse({ headers: true }))
    //     // .on('error', error => console.log(error))
    //     // .on('data', row => console.log(row))
    //     // pipe the parsed input into a csv formatter
    //     // .pipe(
    //     //   csv.format<USER_DATA, USER_DATA_RES>({ headers: true }),
    //     // )
    //     // // Using the transform function from the formatting stream
    //     // .transform((row, next): void => {
    //     //   console.log(row);

    //     //   if (row.userName === val1 && row.password === val2) {
    //     //     return next(null, row);
    //     //   } else {
    //     //     next(null, row);
    //     //   }
    //     //   // User.findById(+row.id, (err, user) => {
    //     //   //     if (err) {
    //     //   //         return next(err);
    //     //   //     }
    //     //   //     if (!user) {
    //     //   //         return next(new Error(`Unable to find user for ${row.id}`);
    //     //   //     }
    //     //   //     return next(null, {
    //     //   //         id: user.id,
    //     //   //         firstName: row.first_name,
    //     //   //         lastName: row.last_name,
    //     //   //         address: row.address,
    //     //   //         // properties from user
    //     //   //         isVerified: user.isVerified,
    //     //   //         hasLoggedIn: user.hasLoggedIn,
    //     //   //         age: user.age,
    //     //   //     });
    //     //   // });
    //     // })
    //     // .pipe(process.stdout)
    //     .on('data', row => console.log(row))
    //     .on('end', (a: any, b: any) => {
    //       console.log(a);
    //       console.log(b);
    //       process.exit();
    //     });
    // }).then((res) => {
    //   console.log(res);
    // });
    //const [tgtToekn]: Array<TOKEN> = Object.values(sys.TOKENS).filter((token: TOKEN) => token.token === val1);
    // console.log(a);
    // if (tgtToekn) {
    //   [userinfo] = users.filter((user: USER_DATA) => user.id === tgtToekn.userID);
    // } else {
    //   [userinfo] = users.filter((user: USER_DATA) => user.userName === val1 && user.password === val2);
    // }
    // return { ...userinfo, token: tgtToekn?.token || '' };
  },

  clearToken: (tokenID: string) => {
    const sys: SYS_INFO = JSON.parse(fs.readFileSync(SYS, 'utf8'));
    const [tgtTokenObj] = Object.values(sys.TOKENS).filter(tokenObj => tokenObj.token === tokenID);
    tgtTokenObj.userID && delete sys.TOKENS[tgtTokenObj.userID];
    fs.writeFile(SYS, JSON.stringify(sys), (err) => {
      if (err) return console.error(err);
      return console.info(`Has update mock data into ${SYS}`);
    });
  },

  send_auth: (req: Request, res: Response) => {
    res.json({
      status: 200,
      error_message: '',
    });
  },

  verify_code: (req: Request, res: Response) => {
    res.json({
      status: 200,
      error_message: '',
    });
  },

  wechat_bind:(req: Request, res: Response) => {
    // res.statusCode = 400;
    res.json({
      status: 200,
      error_message: '',
      pid: '11111111111',
    });
  },
}