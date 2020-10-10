
import fs from 'fs';
import path from 'path';
import { Response, Request } from "express";
import {
  ORG_DATA,
  ORG_TREE_NDOE_ITEM_RES,
  ORG_TREE_RES,
  ORG_TREE_ROOT_ITEM_RES,
} from '../interfaces';
import sys from './sys';
import { ROLE } from '../enum';

const SYS = path.join(__dirname, '../MockData/sys.json');
const DISEASESPATH = path.join(__dirname, '../MockData/RawMaterials/diseases.json');
const USERS = path.join(__dirname, '../MockData/users.json');
const RECORDS = path.join(__dirname, '../MockData/records.json');
const PATIENTS = path.join(__dirname, '../MockData/patients.json');
const PRODUCT_INFO = path.join(__dirname, '../MockData/RawMaterials/productInfo.json');
const ORGS = path.join(__dirname, '../MockData/orgs.json');

export default {

  getOrgsTreeByUser: (req: Request, res: Response) => {
    // const orgs = JSON.parse(fs.readFileSync(ORGS, 'utf8'));
    // let str = '';
    // const userInfo = sys.analyticalAuthorization(req);
    // req.on('data', (chunk) => { str += chunk; });
    // req.on('end', () => {
    //   const reqData = JSON.parse(str);
    //   res.statusCode = userInfo ? 200 : 400;
    //   let error_message: string = '';
    //   const orgDatas: Array<ORG_TREE_ROOT_ITEM_RES> = [];
    //   if (userInfo) {
    //     switch (userInfo.role) {
    //       case ROLE.SUP_AD:
    //         orgs.forEach((org: ORG_DATA) => {
    //           if (!org.parentID) {
    //             if (orgDatas.filter((eOrg: ORG_TREE_ROOT_ITEM_RES) => eOrg.id === org.id).length <= 0) {
    //               orgDatas.push({
    //                 id: org.id,
    //                 name: org.name,
    //                 org_list: [],
    //               });
    //             }
    //           } else {
    //             orgDatas.forEach((eOrg: ORG_TREE_ROOT_ITEM_RES) => {
    //               if (org.parentID === eOrg.id && eOrg.org_list.filter((secOrgItem: ORG_TREE_NDOE_ITEM_RES) => secOrgItem.id === org.id).length <= 0) {
    //                 eOrg.org_list.push({
    //                   id: org.id,
    //                   name: org.name,
    //                 });
    //               }
    //             });
    //           }
    //         });
    //         console.log(orgDatas);
    //         break;
    //       case ROLE.SYS_AD:
    //         if (userInfo.orgID) {
    //           const [sysOrg] = orgs.filter((org: ORG_DATA) => userInfo.orgID === org.id);
    //           const children = orgs.filter((org: ORG_DATA) => userInfo.orgID === org.parentID);
    //           orgDatas.push({
    //             id: sysOrg.id,
    //             name: sysOrg.name,
    //             org_list: children.map((org: ORG_DATA) => ({
    //               id: org.id,
    //               name: org.name,
    //             })),
    //           })
    //         }
    //         break;
    //       case ROLE.ORG_AD:
    //         if (userInfo.orgID) {
    //           const [tgtOrg] = orgs.filter((org: ORG_DATA) => userInfo.orgID === org.id);
    //           orgDatas.push({
    //             id: tgtOrg.id,
    //             name: tgtOrg.name,
    //             org_list: [],
    //           });
    //         }
    //         break;
    //       default:
    //         res.statusCode = 403;
    //         error_message = 'You has no permission to see the orgs info!!'
    //         break
    //     }
    //   } else {
    //     error_message = 'token over time or invalid token val!!'
    //   }
    //   const orgTreeRes: ORG_TREE_RES = {
    //     name: '',
    //     org_name: '',
    //     role: '',
    //     data: orgDatas,
    //   };
    //   res.statusCode = userInfo ? 200 : 400;
    //   res.json({
    //     ...res.statusCode !== 403 && orgTreeRes || {},
    //     status: res.statusCode,
    //     error_message,
    //   });
    // });
  }
}