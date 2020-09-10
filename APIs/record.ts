import fs from 'fs';
import path from 'path';
import { Response, Request, urlencoded } from "express";
import { USER_DATA, ORG_DATA, RECORD_RES, RECORD_DATA, ORG_RES, PATIENT_DATA, DIS_RESULT, RESULT, DISEASE_DATA } from '../interfaces';
import sys from './sys';
import { getAge } from '../MockData/utils';
import { LOGIN_STATE, AUTHOR_PREFIX, DISEASES } from '../enum';


const SYS = path.join(__dirname, '../MockData/sys.json');
const DISEASESPATH = path.join(__dirname, '../MockData/RawMaterials/diseases.json');
const USERS = path.join(__dirname, '../MockData/users.json');
const RECORDS = path.join(__dirname, '../MockData/records.json');
const PATIENTS = path.join(__dirname, '../MockData/patients.json');
const PRODUCT_INFO = path.join(__dirname, '../MockData/RawMaterials/productInfo.json');
const ORGS = path.join(__dirname, '../MockData/orgs.json');

export default {
  getRecords: (req: Request, res: Response) => {
    const orgs = JSON.parse(fs.readFileSync(ORGS, 'utf8'));
    const users = JSON.parse(fs.readFileSync(USERS, 'utf8'));
    const records = JSON.parse(fs.readFileSync(RECORDS, 'utf8'));
    const patients = JSON.parse(fs.readFileSync(PATIENTS, 'utf8'));
    const patientsObj: { [key: string]: PATIENT_DATA } = {};
    const diseases = JSON.parse(fs.readFileSync(DISEASESPATH, 'utf8'));
    const diseaseObj: { [key: string]: DISEASE_DATA } = {};
    diseases.forEach((dis:DISEASE_DATA)=>{
      diseaseObj[dis.key] = dis;
    });
    patients.forEach((patient: PATIENT_DATA) => {
      patientsObj[patient.id] = patient
    });

    let str = '';
    const userInfo = sys.analyticalAuthorization(req);
    const token = sys.getToken(userInfo.id, true);
    req.on('data', (chunk) => { str += chunk; });
    req.on('end', () => {
      const reqData = JSON.parse(str);
      const {
        pageNo, pageSize, searchId, reviewed,
        age: [minAge, maxAge],
        exam_count: [minExamCount, maxExamCount],
        uploadTime: [minUploadTime, maxUploadTime],
        uploader_site: uploaderSites,
        viewer_site: viewerSites,
        viewer: viewers,
        ai_disease: aiDiags,
        doctor_disease: drDiags,
        // search,
      } = reqData;
      res.statusCode = userInfo && token && 200 || 500;
      if (userInfo && token) {

        const [tgtOrgInfo]: Array<ORG_DATA> = orgs.filter((org: ORG_DATA) => org.id === userInfo.orgID);
        const relatedOrgs: Array<ORG_DATA> = orgs.filter((org: ORG_DATA) => tgtOrgInfo.authorizedOrgIDs.indexOf(org.id) >= 0);
        const relatedOrgsObj: { [key: string]: ORG_DATA } = {};
        relatedOrgs.forEach((org: ORG_DATA) => { relatedOrgsObj[org.id] = org });
        const Drs: Array<USER_DATA> =
          users.filter((user: USER_DATA) =>
            user.orgID === tgtOrgInfo.id
            || tgtOrgInfo.authorizedOrgIDs.indexOf(user.orgID) >= 0);
        const DrsObj: { [key: string]: USER_DATA } = {};
        Drs.forEach((user: USER_DATA) => DrsObj[user.id] = user);
        const DrIDs: Array<string> = Drs.map((user: USER_DATA) => user.id);

        const realtedRecords: Array<RECORD_DATA> = records.filter((record: RECORD_DATA) =>
          (record.uploaderID && DrIDs.indexOf(record.uploaderID) >= 0)
          || (record.viewerID && DrIDs.indexOf(record.viewerID) >= 0)
          || (record.patientCreatedBy && DrIDs.indexOf(record.patientCreatedBy) >= 0)
        )
        const relatedRecordsRes: Array<{}> = realtedRecords.map((record: RECORD_DATA) => {
          const ai_disease: Array<DIS_RESULT> = [];
          const doctor_disease: Array<DIS_RESULT> = [];
          if (record.disease) {
            Object.entries(record.disease).forEach(([key, dis]: [string, RESULT | string | undefined]) => {
              ai_disease.push({ [key]: dis && typeof dis === 'object' && dis.AI || '' });
              doctor_disease.push({ [key]: dis && typeof dis === 'object' && dis.doctor || '' });
            });
            ai_disease.sort((obj1, obj2) => diseaseObj[Object.keys(obj1)[0]].index - diseaseObj[Object.keys(obj2)[0]].index);
            doctor_disease.sort((obj1, obj2) => diseaseObj[Object.keys(obj1)[0]].index - diseaseObj[Object.keys(obj2)[0]].index);
          }

          return ({
            ...record,
            // id: record.id,
            // pid: record.pid,
            // examTime: record.examTime,
            //diagnosis?: number,
            // photo?: PHOTO_MAIN_BRIEFLY_RES,
            // history_info?: HISTORY_INFO_RES,
            ai_disease: ai_disease.slice(0, 1),
            doctor_disease: doctor_disease.slice(0, 1),
            // doctor_disease: Array < DIS_RESULT >,
            age: getAge(patientsObj[record.pid].birthday),
            birthday: patientsObj[record.pid].birthday,
            // checkTime: record.checkTime,
            exam_count: realtedRecords.filter((rec: RECORD_DATA) => rec.pid === record.pid).length,
            gender: patientsObj[record.pid].gender,
            mobile: patientsObj[record.pid].mobile,
            name: patientsObj[record.pid].name,
            // reviewed: record.reviewed,
            // uploadTime: record.uploadTime,
            uploader: record.uploaderID && DrsObj[record.uploaderID] || '',
            uploader_org: record.uploaderID && relatedOrgsObj[DrsObj[record.uploaderID].orgID] || '',
            uploader_orgID: record.uploaderID && DrsObj[record.uploaderID].orgID || '',
            viewer: record.viewerID && DrsObj[record.viewerID] || '',
            viewer_site: record.viewerID && relatedOrgsObj[DrsObj[record.viewerID].orgID] || '',
            viewer_orgID: record.viewerID && DrsObj[record.viewerID].orgID || '',
          });
        });


        // const realtedOrgs:Array<ORG_DATA> = 
        // const DrArea: Array<USER_DATA> = users.filter((user: USER_DATA) => tgtOrgInfo.authorizedOrgIDs.indexOf(user.orgID) >= 0 || user.orgID === tgtOrgID);

        //   //const relatedOrgs:Array<ORG_DATA> = orgs.filter(site => site.drs.filter(drID => drID === userInfo.id).length > 0,);
      }

    });
  },

  getRecord: (req: Request, res: Response) => {

  },
}