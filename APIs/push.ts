
import fs from 'fs';
import path from 'path';
import { Response, Request } from "express";
import {
  ORG_DATA,
  ORG_TREE_NDOE_ITEM_RES,
  ORG_TREE_RES,
  ORG_TREE_ROOT_ITEM_RES,
  RECORD_DATA,
} from '../interfaces';
import sys from './sys';
import { RECORD_STATE, ROLE } from '../enum';

const RECORDS = path.join(__dirname, '../MockData/records.json');
const ORGS = path.join(__dirname, '../MockData/orgs.json');

export default {
  getPushLen: (req: Request, res: Response) => {
    // const records = JSON.parse(fs.readFileSync(RECORDS, 'utf8'));
    // const orgs = JSON.parse(fs.readFileSync(ORGS, 'utf8'));
    // let str = '';
    // const userInfo = sys.analyticalAuthorization(req);
    // req.on('data', (chunk) => { str += chunk; });
    // req.on('end', () => {
    //   res.statusCode = userInfo ? 200 : 400;
    //   let error_message: string = '';
    //   let relatedReocrds: Array<RECORD_DATA> = [];
    //   let relatedOrgIDs: Array<string> = [];
    //   if (userInfo) {
    //     if (userInfo.orgID) {
    //       const uploaderOrgs = orgs.filter((org: ORG_DATA) => org.authorizedOrgIDs.indexOf(userInfo.orgID) >= 0).map((org: ORG_DATA) => org.id);
    //       relatedOrgIDs = Object.assign([], [userInfo.orgID], uploaderOrgs);
    //       relatedReocrds = records.filter((record: RECORD_DATA) => record.uploaderORGID && relatedOrgIDs.indexOf(record.uploaderORGID) >= 0);
    //     } else {
    //       res.statusCode = 401;
    //       error_message = 'current user not belong to any org or user is super admin.'
    //     }
    //   } else {
    //     error_message = 'token over time or invalid token val!!'
    //   }
    //   res.json({
    //     status: res.statusCode,
    //     error_message,
    //     length: relatedReocrds.filter((record: RECORD_DATA) => record.reviewed === RECORD_STATE.REVIEWED && record.push).length,
    //   });
    // });
  }
};
