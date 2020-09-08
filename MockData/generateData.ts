import '../enum';
import {
  ORG_DATA,
  PATIENT_DATA,
  RECORD_DATA,
  USER_DATA,
  PHOTO_DATA,
  CONFIG_MODULE_ITEM,
} from '../interfaces';
import fs from 'fs';
import path from 'path';

import {
  guid, randomNum,
} from './utils';


interface COUNT {
  [key: string]: number
}
interface BOOLEAN {
  [key: string]: boolean
}

interface CACHE {
  ORG_ADMIN_COUNT: COUNT,
  ORG_EXTEND: BOOLEAN,
}

const CACHE: CACHE = {
  ORG_ADMIN_COUNT: {},
  ORG_EXTEND: {},
};

const patientes: Array<PATIENT_DATA> = [];
const orgs: Array<ORG_DATA> = [];
const records: Array<RECORD_DATA> = [];
const photos: Array<PHOTO_DATA> = [];
const users: Array<USER_DATA> = [];

const MATERIAL = {
  CONF: path.join(__dirname, './RawMaterials/config.json'),
  OT: path.join(__dirname, './RawMaterials/other.json'),
  ADDRESS: path.join(__dirname, './RawMaterials/address.json'),
  DR_NAMES: path.join(__dirname, './RawMaterials/doctorNames.json'),
  ORG_NAMES: path.join(__dirname, './RawMaterials/orgNames.json'),
  PATIENTS_NAMES: path.join(__dirname, './RawMaterials/patientNames.json'),
  PRODUCT_INFO: path.join(__dirname, './RawMaterials/productInfo.json'),
};

const PATINETS = path.join(__dirname, './patients.json');
const RECORDS = path.join(__dirname, './records.json');
const USERS = path.join(__dirname, './users.json');
const ORGS = path.join(__dirname, './orgs.json');
const PHOTOS = path.join(__dirname, './photos.json');

const CONF = JSON.parse(fs.readFileSync(MATERIAL.CONF, 'utf8'));
const OTS = JSON.parse(fs.readFileSync(MATERIAL.CONF, 'utf8'));


export const generalOrgs = () => {
  const names = JSON.parse(fs.readFileSync(MATERIAL.ORG_NAMES, 'utf8'));
  const address = JSON.parse(fs.readFileSync(MATERIAL.ADDRESS, 'utf8'));
  const admins: Array<string> = [];
  // do {
  //   const adminID = users[randomNum(users.length)].id;
  //   if (admins.indexOf(adminID) < 0) {
  //     admins.push(adminID);
  //   }
  // } while (admins.length < adminCount);
  names.forEach((NAME: string) => {
    const hasParent: boolean = randomNum(2) < 1;
    let parentID: string = '';
    if (hasParent) {
      const parent: ORG_DATA = orgs[randomNum(orgs.length)];
      if (!parent.parentID && orgs.filter((org: ORG_DATA) => org.parentID === parent.id).length < CONF.maxOrgForOneOrg) {
        parentID = parent.id;
      }
    }
    const orgItem: ORG_DATA = {
      id: `ORG${guid()}`,
      name: NAME,
      address: address[randomNum(address.length)],
      admins,
      parentID,
      logo: '',
      logo_name: '',
      disclaimer: '',
      authorized: [],
    };
    CACHE.ORG_ADMIN_COUNT[orgItem.id] = randomNum(CONF.maxAdminCount);
    CACHE.ORG_EXTEND[orgItem.id] = randomNum(2) < 1;
    orgs.push(orgItem);
  });
};

export const generalDevices = () => { };
export const generalUser = () => {
  const names = JSON.parse(fs.readFileSync(MATERIAL.DR_NAMES, 'utf8'));
  const roleKeys = Object.keys(ROLE);
  const roleKeysLen = roleKeys.length;
  // if(org)

  names.forEach((name: string, index: number) => {
    const role = [];
    const org = orgs[randomNum(orgs.length)];
    const orgID: string = org.id;
    const setAsAdmin: boolean = randomNum(2) < 1;
    if (index === 0) {
      role.push(ROLE.SUP_AD);
    } else if (setAsAdmin && org.admins.length < CACHE.ORG_ADMIN_COUNT[orgID]) {
      role.push((orgs.filter((orgItem: ORG_DATA) => orgItem.parentID === org.id).length > 0 && ROLE.SYS_AD) || ROLE.ORG_AD);
    } else {
      role.push(ROLE.DR);
    }
    const permission = {
      [OPERATION_PERMISSIONS.ADMIN]: index === 0 ? true : randomNum(2) < 1,
      [OPERATION_PERMISSIONS.AUDIT_TRANSFER]: index === 0 ? true : randomNum(2) < 1,
      [OPERATION_PERMISSIONS.PATIENT_AD]: index === 0 ? true : randomNum(2) < 1,
      [OPERATION_PERMISSIONS.PUSH_RD]: index === 0 ? true : randomNum(2) < 1,
      [OPERATION_PERMISSIONS.REVIEWED_RD]: index === 0 ? true : randomNum(2) < 1,
      [OPERATION_PERMISSIONS.TRANSFER_RD]: index === 0 ? true : randomNum(2) < 1,
    };
    const comment: CONFIG_MODULE_ITEM = {
      id: MODULE_PERMISSIONS.COMMENT,
      is_display: randomNum(2) < 1,
    }
    if (CACHE.ORG_ADMIN_COUNT[org.id]) {
      comment.is_extended = true;
    }
    // if(isExtend)
    const config = {
      [MODULE_PERMISSIONS.COMMENT]: comment,
      // {

      //   // is_extended?: randomNum(2) < 1,                                                  // 天津四特别扩展开关
      //   // detail?: Array < CONFIG_MODULE_ITEM | CONFIG_LESSION | CONFIG_DISEASE >,
      // }
      [MODULE_PERMISSIONS.ENA_MEASURE]:
        [MODULE_PERMISSIONS.EXP_REPORT]:
      [MODULE_PERMISSIONS.HISTORY_INFO]:
        [MODULE_PERMISSIONS.QUALITY_CONTROL]:
      [MODULE_PERMISSIONS.R_REVISIT_INTERVAL]:
        [MODULE_PERMISSIONS.R_TRANSFER_MODE]:
    }
    const user: USER_DATA = {
      id: `USER${guid()}`,
      userName: name,
      name: `test_${index}`,
      password: 'test',
      role,
      permission,
      config,
      orgID: orgID,
    };
    users.push(user);
  });
};
export const generalPatients = () => { };
export const generalRecords = () => { };

export const generateData = () => {
  generalOrgs();
  generalUser();
  generalDevices();
  generalPatients();
  generalRecords();
};