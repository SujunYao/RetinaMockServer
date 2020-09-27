import {
  ORG_DATA,
  PATIENT_DATA,
  RECORD_DATA,
  USER_DATA,
  PHOTO_DATA,
  CONFIG_MODULE_ITEM,
  CONFIG,
  CONFIG_DISEASE,
  CACHE,
  CONFIG_LESION,
  DEVICE_DATA,
  RESULT,
  PATH_INFO,
  HISTORY_TPL,
  HISTORY_INFO_DATA,
  DISEASE_DATA,
  LESION_DATA,
} from '../interfaces';
import fs from 'fs';
import path from 'path';

import {
  guid, randomNum, addDays, reducingDays,
} from './utils';
import { APP_VERSION, ROLE, OPERATION_PERMISSIONS, DISEASES, AREA, LESIONS, BOOLEAN_STATE, MODULE_PERMISSIONS, MEASURE_LINES, MARKERS, TPL_GROUPS, GENDER, CHECKBOX_MODE, SIDES, RECORD_STATE, PHOTO_QUALITY } from '../enum';
// import APP from '../app';

const CACHE: CACHE = {
  ORG_ADMIN_COUNT: {},
  ORG_PATIENT_MAX: {},
  ORG_EXTEND: {},
};

let patientsCount = 111;

const patients: Array<PATIENT_DATA> = [];
const orgs: Array<ORG_DATA> = [];
const records: Array<RECORD_DATA> = [];
const photos: Array<PHOTO_DATA> = [];
const users: Array<USER_DATA> = [];
const devices: Array<DEVICE_DATA> = [];

const MATERIAL = {
  FILE_PATHS: path.join(__dirname, './RawMaterials/filePaths.json'),
  HISTORY_TPLS: path.join(__dirname, './RawMaterials/historyTemplates.json'),
  LESIONS: path.join(__dirname, './RawMaterials/lesions.json'),
  DISEASES: path.join(__dirname, './RawMaterials/diseases.json'),
  CONF: path.join(__dirname, './RawMaterials/config.json'),
  OT: path.join(__dirname, './RawMaterials/others.json'),
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
const DEVICES = path.join(__dirname, './devices.json');
const SYS = path.join(__dirname, './sys.json');

const CONF = JSON.parse(fs.readFileSync(MATERIAL.CONF, 'utf8'));
const OTS = JSON.parse(fs.readFileSync(MATERIAL.OT, 'utf8'));
const PATHS: Array<PATH_INFO> = JSON.parse(fs.readFileSync(MATERIAL.FILE_PATHS, 'utf8'));
const HISTORY_TPLS: { [key: string]: { [key: string]: HISTORY_TPL } } = {};
const DISEASES_OBJ: { [key: string]: DISEASE_DATA } = {};
const LESIONS_OBJ: { [key: string]: LESION_DATA } = {};
JSON.parse(fs.readFileSync(MATERIAL.HISTORY_TPLS, 'utf8')).forEach((TPL: HISTORY_TPL) => {
  if (!HISTORY_TPLS[TPL.group]) {
    HISTORY_TPLS[TPL.group] = {};
  }
  if (!TPL.parent) {
    HISTORY_TPLS[TPL.group][TPL.id] = TPL;
  } else if (HISTORY_TPLS[TPL.group][TPL.parent]) {
    if (!HISTORY_TPLS[TPL.group][TPL.parent].childs) {
      HISTORY_TPLS[TPL.group][TPL.parent].childs = [];
    }
    HISTORY_TPLS[TPL.group][TPL.parent].childs?.push(TPL);
  }
});

JSON.parse(fs.readFileSync(MATERIAL.LESIONS, 'utf8')).forEach((LES: LESION_DATA) => {
  if (!LES.parent) {
    LESIONS_OBJ[LES.key] = LES;
  } else if (LESIONS_OBJ[LES.parent]) {
    if (!LESIONS_OBJ[LES.parent].childs) {
      LESIONS_OBJ[LES.parent].childs = [];
    }
    LESIONS_OBJ[LES.parent].childs?.push(LES);
  }
});

JSON.parse(fs.readFileSync(MATERIAL.DISEASES, 'utf8')).forEach((DIS: DISEASE_DATA) => {
  if (!DIS.parent) {
    DISEASES_OBJ[DIS.key] = DIS;
  } else if (DISEASES_OBJ[DIS.parent]) {
    if (!DISEASES_OBJ[DIS.parent].childs) {
      DISEASES_OBJ[DIS.parent].childs = [];
    }
    DISEASES_OBJ[DIS.parent].childs?.push(DIS);
  }
});

const generateTPLValues = (TPL: HISTORY_TPL): HISTORY_TPL => {
  let val: string = '';
  let selChildID: string = '';
  const setVal: boolean = randomNum(2) < 1;
  const selOne: boolean = randomNum(2) < 1;
  switch (TPL.valueType) {
    case 'int':
      val = (setVal && randomNum(10, 1).toString()) || '';
      break;
    case 'float':
      val = (setVal && `${randomNum(10, 1)}.${randomNum(10, 1)}`) || '';
      break;
    default:
      val = '';
      break;
  }
  if (TPL.childs && TPL.childs.length > 0 && selOne) {
    selChildID = TPL.childs[randomNum(TPL.childs.length)].id;
  }
  return { ...TPL, val, selChildID, template_id: parseInt(TPL.id) };
};

export const generalOrgs = () => {
  const names = JSON.parse(fs.readFileSync(MATERIAL.ORG_NAMES, 'utf8'));
  const address = JSON.parse(fs.readFileSync(MATERIAL.ADDRESS, 'utf8'));
  names.forEach((NAME: string) => {
    const hasParent: boolean = randomNum(2) < 1;
    const authorizedOrgIDs: Array<string> = [];
    let parentID: string = '';
    if (hasParent) {
      const parent: ORG_DATA = orgs[randomNum(orgs.length - 1)];
      if (parent && !parent.parentID && orgs.filter((org: ORG_DATA) => org.parentID === parent.id).length < CONF.maxOrgForOneOrg) {
        parentID = parent.id;
      }
      if (parentID) { authorizedOrgIDs.push(parentID); }
      const parentChiilds: Array<ORG_DATA> = orgs.filter((org: ORG_DATA) => org.parentID === parent.id);
      const maxAutorizedOrg: number = randomNum(parentChiilds.length);
      const tempArr: Array<string> = [];
      do {
        const child: ORG_DATA = parentChiilds[randomNum(parentChiilds.length)];
        if (child && tempArr.indexOf(child.id) < 0) {
          authorizedOrgIDs.push(child.id);
          tempArr.push(child.id);
        }
      } while (tempArr.length < (maxAutorizedOrg - 1))
    }
    const orgItem: ORG_DATA = {
      id: `ORG${guid()}`,
      name: NAME,
      address: address[randomNum(address.length)],
      parentID,
      authorizedOrgIDs,
      logo: '',
      logo_name: '',
      disclaimer: '',
      authorized: [],
    };
    CACHE.ORG_ADMIN_COUNT[orgItem.id] = randomNum(CONF.maxAdminCount);
    const temp = randomNum(patientsCount);
    CACHE.ORG_PATIENT_MAX[orgItem.id] = temp;
    patientsCount -= temp;
    CACHE.ORG_EXTEND[orgItem.id] = randomNum(2) < 1;
    orgs.push(orgItem);
  });

  fs.writeFile(ORGS, JSON.stringify(orgs), (err) => {
    if (err) return console.error(err);
    return console.info(`Has generated mock data into ${ORGS}`);
  });
};

export const generalUser = () => {
  const names = JSON.parse(fs.readFileSync(MATERIAL.DR_NAMES, 'utf8'));
  names.forEach((name: string, index: number) => {
    let role;
    const org = orgs[randomNum(orgs.length)];
    const orgID: string = org.id;
    const setAsAdmin: boolean = randomNum(2) < 1;
    const appMode: APP_VERSION = index === 0 ? APP_VERSION.ALL : (randomNum(2) < 1 && APP_VERSION.ALL) || APP_VERSION.DR;
    const tgtOrgAdmins = users.filter((user: USER_DATA) =>
      user.orgID === orgID
      && ((user.role.indexOf(ROLE.SYS_AD) >= 0)
        || (user.role.indexOf(ROLE.ORG_AD) >= 0)));
    if (index === 0) {
      role = ROLE.SUP_AD;
    } else if (setAsAdmin && tgtOrgAdmins.length < CACHE.ORG_ADMIN_COUNT[orgID]) {
      role = (orgs.filter((orgItem: ORG_DATA) => orgItem.parentID === org.id).length > 0 && ROLE.SYS_AD) || ROLE.ORG_AD;
    } else {
      role = ROLE.DR;
    }
    const permission = {
      [OPERATION_PERMISSIONS.ADMIN]: index === 0 ? true : randomNum(2) < 1,
      [OPERATION_PERMISSIONS.AUDIT_TRANSFER]: index === 0 ? false : randomNum(2) < 1,
      [OPERATION_PERMISSIONS.PATIENT_AD]: index === 0 ? false : randomNum(2) < 1,
      [OPERATION_PERMISSIONS.PUSH_RD]: index === 0 ? false : randomNum(2) < 1,
      [OPERATION_PERMISSIONS.REVIEWED_RD]: index === 0 ? false : randomNum(2) < 1,
      [OPERATION_PERMISSIONS.TRANSFER_RD]: index === 0 ? false : randomNum(2) < 1,
    };
    // let outsideDR, outsideCSME;
    const outsideDis: {
      [key: string]: {
        id: string,
        is_display: boolean,
        isSupport: boolean,
      }
    } = {};
    const DIS: Array<CONFIG_DISEASE> = [];
    const LES: Array<CONFIG_LESION> = [];
    const areas = [AREA.NONE, AREA.OPTIC_NEUROPATHY, AREA.RETINAL_LESION, AREA.VASCULAR_LESION];
    // generate disease config
    Object.values(DISEASES).forEach((dis: string) => {
      if (appMode === APP_VERSION.DR && (dis === DISEASES.DR || dis === DISEASES.CSME)) {
        outsideDis[dis] = {
          id: dis,
          is_display: randomNum(2) < 1,
          isSupport: randomNum(2) < 1
        };
      } else {
        DIS.push({
          id: dis,
          is_display: randomNum(2) < 1,
          isSupport: randomNum(2) < 1,
          checkbox: DISEASES_OBJ[dis]?.checkbox || 0,
        });
      }
    });
    // generate lesion config
    Object.values(LESIONS).forEach((lesion: string) => {
      LES.push({
        id: lesion,
        is_display: randomNum(2) < 1,
        isSupport: randomNum(2) < 1,
        checkbox: LESIONS_OBJ[lesion]?.checkbox || 0,
        area: areas[randomNum(areas.length)],
        dr_related: (randomNum(2) < 1 && BOOLEAN_STATE.TRUE) || BOOLEAN_STATE.FALSE,
        amd_related: (randomNum(2) < 1 && BOOLEAN_STATE.TRUE) || BOOLEAN_STATE.FALSE,
        hr_related: (randomNum(2) < 1 && BOOLEAN_STATE.TRUE) || BOOLEAN_STATE.FALSE,
        pm_related: (randomNum(2) < 1 && BOOLEAN_STATE.TRUE) || BOOLEAN_STATE.FALSE,
      });
    });

    const config: CONFIG = {
      [MODULE_PERMISSIONS.COMMENT]: {
        id: MODULE_PERMISSIONS.COMMENT,
        is_display: randomNum(2) < 1,
      },
      [MODULE_PERMISSIONS.HISTORY_INFO]: {
        id: MODULE_PERMISSIONS.HISTORY_INFO,
        is_display: randomNum(2) < 1,
      },
      [MODULE_PERMISSIONS.QUALITY_CONTROL]: {
        id: MODULE_PERMISSIONS.QUALITY_CONTROL,
        is_display: randomNum(2) < 1,
      },
      [MODULE_PERMISSIONS.R_TRANSFER_MODE]: {
        id: MODULE_PERMISSIONS.R_TRANSFER_MODE,
        is_display: randomNum(2) < 1,
        is_extended: CACHE.ORG_EXTEND[org.id]
      },
      [MODULE_PERMISSIONS.R_REVISIT_INTERVAL]: {
        id: MODULE_PERMISSIONS.R_REVISIT_INTERVAL,
        is_display: randomNum(2) < 1,
      },
      [MODULE_PERMISSIONS.ENA_MEASURE]: {
        id: MODULE_PERMISSIONS.ENA_MEASURE,
        is_display: randomNum(2) < 1,
        detail: Object.values(MEASURE_LINES).map((line: string): CONFIG_MODULE_ITEM => ({
          id: line,
          is_display: randomNum(2) < 1,
        })),
      },
      [MODULE_PERMISSIONS.EXP_REPORT]: {
        id: MODULE_PERMISSIONS.ENA_MEASURE,
        is_display: randomNum(2) < 1,
      },
      [MODULE_PERMISSIONS.MARKS]: {
        id: MODULE_PERMISSIONS.MARKS,
        is_display: randomNum(2) < 1,
        detail: Object.values(MARKERS).map((name: string) => ({
          id: name,
          name,
          type: 'marker'
        }))
      },
      [MODULE_PERMISSIONS.DISEASE]: {
        id: MODULE_PERMISSIONS.DISEASE,
        is_display: randomNum(2) < 1,
        detail: DIS
      },
      [MODULE_PERMISSIONS.LESION]: {
        id: MODULE_PERMISSIONS.LESION,
        is_display: randomNum(2) < 1,
        detail: LES,
      }
    }

    const user: USER_DATA = {
      id: `USER${guid()}`,
      userName: `test_${index}`,
      name,
      password: 'test',
      role,
      appMode,
      permission,
      config,
      orgID: role !== ROLE.SUP_AD && orgID || '',
    };
    users.push(user);
  });

  fs.writeFile(USERS, JSON.stringify(users), (err) => {
    if (err) return console.error(err);
    return console.info(`Has generated mock data into ${USERS}`);
  });
};

export const generalDevices = () => {
  for (let i = 0; i < CONF.devices; i++) {
    let orgID = orgs[randomNum(orgs.length)].id;
    do {
      orgID = orgs[randomNum(orgs.length)].id;
    } while (devices.filter((device: DEVICE_DATA) => device.orgID === orgID).length >= CONF.maxDevicesForOneOrg)

    devices.push({
      id: `DEVICE${guid(26)}`,
      name: `P${guid(6)}`,
      orgID,
      factory: OTS.manufacturers[randomNum(OTS.manufacturers.length)],
      model: `NO${guid(9)}`,
      is_enabled: randomNum(2) < 1,
      exposureRange: '',
      storageFormat: OTS.fileTypes[randomNum(OTS.fileTypes.length)],
    });
  }
  fs.writeFile(DEVICES, JSON.stringify(devices), (err) => {
    if (err) return console.error(err);
    return console.info(`Has generated mock data into ${DEVICES}`);
  });
};

export const generalPatients = () => {
  const names: Array<string> = JSON.parse(fs.readFileSync(MATERIAL.PATIENTS_NAMES, 'utf8'));
  const tgtNames: Array<string> = (names.length > CONF.patients && names.slice(0, CONF.patients)) || names;
  const genders = [GENDER.FEMALE, GENDER.MALE, GENDER.OTHER];
  tgtNames.forEach((name: string) => {
    const age: number = randomNum(14, 100);
    const curDate: Date = new Date();
    const createDate: Date = new Date(`${curDate.getFullYear() - randomNum(age - 2)}--${randomNum(12, 1)}-${randomNum(28, 1)}`);
    let udpateDate: Date = createDate;
    if (randomNum(2) < 1) {
      const aYear = randomNum(2);
      if (aYear >= 1) {
        udpateDate = new Date(`${createDate.getFullYear() + randomNum(2)}-${randomNum(12, 1)}-${randomNum(28, 1)}`);
      } else {
        const aMonth = createDate.getMonth();
        const rMonth = randomNum(12 - aMonth);
        udpateDate = new Date(`${createDate.getFullYear()}-${aMonth + rMonth}-${rMonth > 0 ? randomNum(28, 1) : curDate.getDate() + randomNum(28 - curDate.getDate())}`);
      }
    }
    // generate HISTORY INFO;
    const maxMainCount = randomNum(Object.values(HISTORY_TPLS[TPL_GROUPS.SELF_EXPLAN]).length);
    const maxExamCount = randomNum(Object.values(HISTORY_TPLS[TPL_GROUPS.OT_RES]).length);
    const maxHistoryCount = randomNum(Object.values(HISTORY_TPLS[TPL_GROUPS.HISTORY]).length);
    const maxNoteCount = randomNum(Object.values(HISTORY_TPLS[TPL_GROUPS.RECORD_NODE]).length);
    const history: HISTORY_INFO_DATA = {
      main: [],
      exam: [],
      history: [],
      exam_info: [],
    };

    Object.keys(history).forEach((groupName: string) => {
      let maxCount = 0;
      let GRP_NAME = '';
      switch (groupName) {
        case 'main':
          maxCount = maxMainCount;
          GRP_NAME = TPL_GROUPS.SELF_EXPLAN;
          break;
        case 'exam':
          maxCount = maxExamCount;
          GRP_NAME = TPL_GROUPS.OT_RES;
          break;
        case 'history':
          maxCount = maxHistoryCount;
          GRP_NAME = TPL_GROUPS.HISTORY;
          break;
        case 'exam_info':
          maxCount = maxNoteCount;
          GRP_NAME = TPL_GROUPS.RECORD_NODE;
          break;
        default:
          maxCount = 0;
          GRP_NAME = '';
          break;
      }
      const tgtTPLs = Object.values(HISTORY_TPLS[GRP_NAME]);
      const used: Array<string> = [];
      do {
        const tgtTPL = tgtTPLs[randomNum(tgtTPLs.length)];
        if (tgtTPL && used.indexOf(tgtTPL.id) <= 0) {
          used.push(tgtTPL.id);
          history[groupName].push(generateTPLValues(tgtTPL));
        }
      } while (history[groupName].length < maxCount)
    });

    let createdBy: string = '';
    const DrArea: Array<USER_DATA> = users.filter((user: USER_DATA) => user.role.indexOf(ROLE.DR) >= 0);
    do {
      const tgtDr = DrArea[randomNum(DrArea.length)];
      if (tgtDr && CACHE.ORG_PATIENT_MAX[tgtDr.orgID] > 0) {
        createdBy = tgtDr.id;
        CACHE.ORG_PATIENT_MAX[tgtDr.orgID]--;
      }
    } while (!createdBy);

    patients.push({
      id: `PTS${guid(18)}`,
      mobile: randomNum(18999999999, 13400000000).toString(),
      name,
      birthday: new Date(`${curDate.getFullYear() - age}-${randomNum(12, 1)}-${randomNum(28, 1)}`),
      ID_number: randomNum(999999999999999999, 100000000000000000).toString(),
      clinic_card_id: `V${randomNum(12)}`,
      social_security_id: guid(8),
      inpatient_id: `H${guid(12)}`,
      gender: genders[randomNum(genders.length)],
      has_deleted: (randomNum(2) < 1 && BOOLEAN_STATE.TRUE) || BOOLEAN_STATE.FALSE,
      other_info: '',
      history,
      createdBy,
      create_time: createDate,
      update_time: udpateDate,
    });
  });

  fs.writeFile(PATINETS, JSON.stringify(patients), (err) => {
    if (err) return console.error(err);
    return console.info(`Has generated mock data into ${PATINETS}`);
  });
};

const fitResultVal = (key: DISEASES | LESIONS | string, setAI: boolean, setDoctor: boolean): RESULT | string => {
  const res: RESULT = { AI: '', doctor: '' };
  const tgt: LESION_DATA | DISEASE_DATA = LESIONS_OBJ[key] || DISEASES_OBJ[key];
  if (setAI) {
    const isAIFalse: boolean = randomNum(2) < 1;
    switch (tgt.checkbox) {
      case CHECKBOX_MODE.NONE:
        res.AI = (isAIFalse && false) || true;
        break;
      case CHECKBOX_MODE.MULTI:
        const selMaxCount = randomNum(tgt.childs?.length || 0);
        let selIDs: Array<string> = [];
        let selVals: Array<number> = [];
        if (selMaxCount > 0 && tgt.childs && tgt.childs.length > 0) {
          do {
            const selSubItem = tgt.childs[randomNum(tgt.childs?.length)];
            if (selIDs.indexOf(selSubItem.id) < 0) {
              selIDs.push(selSubItem.id);
              selVals.push(selSubItem.index);
            }
          } while (selIDs.length < selMaxCount)
        }
        res.AI = (isAIFalse && false) || selVals.sort((a: number, b: number) => a - b).join('') || false;
        break;
      case CHECKBOX_MODE.SINGLE:
        if (tgt.childs && tgt.childs.length > 0) {
          const selSubItem = tgt.childs[randomNum(tgt.childs?.length)];
          res.AI = (isAIFalse && false) || selSubItem.index;
        }
        break;
      default:
        break;
    }
  }
  if (setDoctor) {
    const isDoctorFalse: boolean = randomNum(2) < 1;
    switch (tgt.checkbox) {
      case CHECKBOX_MODE.NONE:
        res.doctor = (isDoctorFalse && false) || true;
        break;
      case CHECKBOX_MODE.MULTI:
        const selMaxCount = randomNum(tgt.childs?.length || 0);
        let selIDs: Array<string> = [];
        let selVals: Array<number> = [];
        if (selMaxCount > 0 && tgt.childs && tgt.childs.length > 0) {
          do {
            const selSubItem = tgt.childs[randomNum(tgt.childs?.length)];
            if (selIDs.indexOf(selSubItem.id) < 0) {
              selIDs.push(selSubItem.id);
              selVals.push(selSubItem.index);
            }
          } while (selIDs.length < selMaxCount)
        }
        res.doctor = (isDoctorFalse && false) || selVals.sort((a: number, b: number) => a - b).join('');
        break;
      case CHECKBOX_MODE.SINGLE:
        if (tgt.childs && tgt.childs.length > 0) {
          const selSubItem = tgt.childs[randomNum(tgt.childs?.length)];
          res.doctor = (isDoctorFalse && false) || selSubItem.index;
        }
        break;
      default:
        break;
    }
  }
  return key === DISEASES.OT && ' ' || res;
};

const insertPhotos = (recordID: string, state: RECORD_STATE): Array<number> => {
  const maxPhotos = randomNum(CONF.maxPhotosForOneRecord, 1);
  const tgtFile = PATHS[randomNum(PATHS.length)];
  const tgtPhotoIDs: Array<number> = [];
  const qualities = [PHOTO_QUALITY.BAD, PHOTO_QUALITY.GOOD, PHOTO_QUALITY.NORMAL, PHOTO_QUALITY.NOT_APPLICABLE, PHOTO_QUALITY.NO_CALC]
  for (let i = 0; i < maxPhotos; i++) {
    const lesions: { [key: string]: RESULT | string } = {};
    Object.values(LESIONS).forEach((LES: string) => {
      lesions[LES] = fitResultVal(LES, state !== RECORD_STATE.CALCING, (state === RECORD_STATE.PUSHED || state === RECORD_STATE.REVIEWED));
    })
    let photo: PHOTO_DATA = {
      ai_markers: [],
      art_mask: '',
      art_ratio: { AI: '', doctor: '' },
      brightness: 0,
      contrast: 0,
      cup_disk_mask: '',
      cup_disk_ratio: { AI: '', doctor: '' },
      diskBox: {},
      filesize: tgtFile.size.toString(),
      height: tgtFile.height,
      id: parseInt(guid()),
      imageUrl: tgtFile.big,
      lesions,
      maculaBox: {},
      markers: [],
      measureData: {
        art_ratio: {                // 动静脉比值(arteriovenous_ratio)
          numerator: {},
          denominator: {},
        },
        disk_cup_ratio: {           // 视杯视盘比值
          numerator: {},
        },
        custom_ratio: {             // 自定义比值
          numerator: {},
          denominator: {},
          denominatorLabel: '',
          numeratorLabel: '',       // 最大长度40
        },
      },
      px_ratio: 0,
      side: (randomNum(2) < 1 && SIDES.LEFT || SIDES.RIGHT),
      thumbUrl: tgtFile.small,
      width: tgtFile.width,
      recordID,
      quality: qualities[randomNum(qualities.length)]
    };
    switch (state) {
      case RECORD_STATE.CREATED:
        photo.diskBox = {
          centerPoint: {
            x: parseFloat(`0.${randomNum(9999, 1000)}`),
            y: parseFloat(`0.${randomNum(9999, 1000)}`),
          },
          radius: parseFloat(`0.0${randomNum(999, 100)}`),
        };
        photo.maculaBox = {
          centerPoint: {
            x: parseFloat(`0.${randomNum(9999, 1000)}`),
            y: parseFloat(`0.${randomNum(9999, 1000)}`),
          },
        };
        photo.art_ratio.AI = `${randomNum(2)}:${randomNum(2)}.${randomNum(10, 1)}`;
        photo.cup_disk_ratio.AI = `${randomNum(2)}.${randomNum(10)}:${randomNum(2)}`;
        break;
      case RECORD_STATE.REVIEWED:
      case RECORD_STATE.PUSHED:
        photo.diskBox = {
          centerPoint: {
            x: parseFloat(`0.${randomNum(9999, 1000)}`),
            y: parseFloat(`0.${randomNum(9999, 1000)}`),
          },
          radius: parseFloat(`0.0${randomNum(999, 100)}`),
        };
        photo.maculaBox = {
          centerPoint: {
            x: parseFloat(`0.${randomNum(9999, 1000)}`),
            y: parseFloat(`0.${randomNum(9999, 1000)}`),
          },
        };
        photo.art_ratio = {
          AI: `${randomNum(2)}:${randomNum(2)}.${randomNum(10, 1)}`,
          doctor: `${randomNum(2)}:${randomNum(2)}.${randomNum(10, 1)}`,
        };
        photo.cup_disk_ratio = {
          AI: `${randomNum(2)}:${randomNum(2)}.${randomNum(10, 1)}`,
          doctor: `${randomNum(2)}:${randomNum(2)}.${randomNum(10, 1)}`,
        };
        break;
      default:
        break;
    }
    tgtPhotoIDs.push(photo.id);
    photos.push(photo);
  }
  return tgtPhotoIDs;
};

export const generalRecords = () => {
  const maxCount = CONF.records;
  const states = [RECORD_STATE.CALCING, RECORD_STATE.CREATED, RECORD_STATE.PUSHED, RECORD_STATE.REVIEWED];
  for (let i = 0; i < maxCount; i++) {
    let tgtPatient = patients[randomNum(patients.length)];
    do {
      tgtPatient = patients[randomNum(patients.length)];
    } while (records.filter((rec: RECORD_DATA) => rec.pid === tgtPatient.id).length >= CONF.maxRecordsForOnePatient);
    const tgtState = states[randomNum(states.length)];
    let examTime = addDays(tgtPatient.update_time, randomNum(20, 1));
    let checkTime: string | Date = '';
    let viewerID = '';
    const recordID = `REC${guid(18)}`;
    const tgtRecordPhotoIDs = insertPhotos(recordID, tgtState);

    const [{ orgID: tgtOrgID }]: Array<USER_DATA> = users.filter((user: USER_DATA) => user.id === tgtPatient.createdBy);
    const [tgtOrgInfo]: Array<ORG_DATA> = orgs.filter((org: ORG_DATA) => org.id === tgtOrgID);
    const DrArea: Array<USER_DATA> = users.filter((user: USER_DATA) => tgtOrgInfo.authorizedOrgIDs.indexOf(user.orgID) >= 0 || user.orgID === tgtOrgID);

    switch (tgtState) {
      case RECORD_STATE.REVIEWED:
      case RECORD_STATE.PUSHED:
        checkTime = addDays(examTime, randomNum(20, 1));
        if (checkTime > new Date()) {
          checkTime = reducingDays(new Date(), randomNum(5, 1));
        }
        viewerID = DrArea[randomNum(DrArea.length)].id
        break;
      default:
        break;
    }
    const disease: { [key in DISEASES]?: RESULT | string } = {};
    Object.values(DISEASES).forEach((DIS: DISEASES) => {
      disease[DIS] = fitResultVal(DIS, tgtState !== RECORD_STATE.CALCING, (tgtState === RECORD_STATE.PUSHED || tgtState === RECORD_STATE.REVIEWED));
    });

    records.push({
      id: recordID,
      pid: tgtPatient.id,
      examTime,
      disease,
      push: tgtState === RECORD_STATE.REVIEWED && randomNum(2) < 1 || false,
      // ai_disease,
      // doctor_disease,
      photoIDs: tgtRecordPhotoIDs,
      checkTime,
      reviewed: tgtState,
      patientCreatedBy: tgtPatient.createdBy,
      uploaderID: randomNum(2) < 1 && tgtPatient.createdBy || DrArea[randomNum(DrArea.length)].id,
      viewerID,
    });
  }

  fs.writeFile(PHOTOS, JSON.stringify(photos), (err) => {
    if (err) return console.error(err);
    return console.info(`Has generated mock data into ${PHOTOS}`);
  });
  fs.writeFile(RECORDS, JSON.stringify(records), (err) => {
    if (err) return console.error(err);
    return console.info(`Has generated mock data into ${RECORDS}`);
  });
};

export const clearSYS = () => {
  fs.writeFile(SYS, JSON.stringify({
    TOKENS: {},
    LOGIN_USER: {},
    LANG: '',
  }), (err) => {
    if (err) return console.error(err);
    return console.info(`Has generated mock data into ${SYS}`);
  });
}

export const generateAllData = () => {
  generalOrgs();
  generalUser();
  generalDevices();
  generalPatients();
  generalRecords();
};