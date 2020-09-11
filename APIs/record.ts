import fs from 'fs';
import path from 'path';
import { Response, Request, urlencoded } from "express";
import { USER_DATA, ORG_DATA, RECORD_RES, RECORD_DATA, ORG_RES, PATIENT_DATA, DIS_RESULT, RESULT, DISEASE_DATA, VIEWER_BRIEFLY_RES, ORG_BRIEFLY_RES } from '../interfaces';
import sys from './sys';
import { getAge } from '../MockData/utils';
import { LOGIN_STATE, AUTHOR_PREFIX, DISEASES, RECORD_STATE } from '../enum';

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
    diseases.forEach((dis: DISEASE_DATA) => {
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
        const relatedOrgs: Array<ORG_DATA> = orgs.filter((org: ORG_DATA) => tgtOrgInfo.authorizedOrgIDs.indexOf(org.id) >= 0 || org.id === userInfo.orgID);
        const relatedOrgsObj: { [key: string]: ORG_DATA } = {};
        relatedOrgs.forEach((org: ORG_DATA) => { relatedOrgsObj[org.id] = org });
        const Drs: Array<USER_DATA> =
          users.filter((user: USER_DATA) =>
            user.orgID === tgtOrgInfo.id
            || tgtOrgInfo.authorizedOrgIDs.indexOf(user.orgID) >= 0);
        const DrsObj: { [key: string]: USER_DATA } = {};
        Drs.forEach((user: USER_DATA) => DrsObj[user.id] = user);
        const DrIDs: Array<string> = Drs.map((user: USER_DATA) => user.id);

        const relatedRecords: Array<RECORD_DATA> = records.filter((record: RECORD_DATA) =>
          (record.uploaderID && DrIDs.indexOf(record.uploaderID) >= 0)
          || (record.viewerID && DrIDs.indexOf(record.viewerID) >= 0)
          || (record.patientCreatedBy && DrIDs.indexOf(record.patientCreatedBy) >= 0)
        );
        const uploader_orgs: Array<ORG_BRIEFLY_RES> = [];
        const viewer_orgs: Array<ORG_BRIEFLY_RES> = [];
        const viewUsers: Array<VIEWER_BRIEFLY_RES> = []
        const uploader_orgs_obj: { [key: string]: ORG_BRIEFLY_RES } = {};
        const viewer_orgs_obj: { [key: string]: ORG_BRIEFLY_RES } = {};
        const viewUsers_obj: { [key: string]: VIEWER_BRIEFLY_RES } = {};
        const relatedRecordsRes: Array<{}> = relatedRecords.map((record: RECORD_DATA) => {
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
          if (record.viewerID && !viewUsers_obj[record.viewerID]) {
            viewUsers_obj[record.viewerID] = {
              name: DrsObj[record.viewerID].name,
              org_name: relatedOrgsObj[DrsObj[record.viewerID].orgID].name,
              user_id: DrsObj[record.viewerID].id,
              username: DrsObj[record.viewerID].userName,
            }
            viewUsers.push(viewUsers_obj[record.viewerID]);
          }
          if (record.viewerID && !viewer_orgs_obj[DrsObj[record.viewerID].orgID]) {
            viewer_orgs_obj[DrsObj[record.viewerID].orgID] = {
              name: relatedOrgsObj[DrsObj[record.viewerID].orgID].name,
              id: relatedOrgsObj[DrsObj[record.viewerID].orgID].id,
            }
            viewer_orgs.push(viewer_orgs_obj[DrsObj[record.viewerID].orgID]);
          }
          if (record.uploaderID && !uploader_orgs_obj[DrsObj[record.uploaderID].orgID]) {
            uploader_orgs_obj[DrsObj[record.uploaderID].orgID] = {
              name: relatedOrgsObj[DrsObj[record.uploaderID].orgID]?.name,
              id: relatedOrgsObj[DrsObj[record.uploaderID].orgID].id,
            }
            uploader_orgs.push(uploader_orgs_obj[DrsObj[record.uploaderID].orgID]);
          }

          return ({
            ...record,
            ai_disease: ai_disease,
            doctor_disease: doctor_disease,
            age: getAge(new Date(patientsObj[record.pid].birthday)),
            birthday: patientsObj[record.pid].birthday,
            exam_count: relatedRecords.filter((rec: RECORD_DATA) => rec.pid === record.pid).length,
            gender: patientsObj[record.pid].gender,
            mobile: patientsObj[record.pid].mobile,
            name: patientsObj[record.pid].name,
            uploader: record.uploaderID && DrsObj[record.uploaderID] || '',
            uploader_org: record.uploaderID && relatedOrgsObj[DrsObj[record.uploaderID].orgID] || '',
            uploader_orgID: record.uploaderID && DrsObj[record.uploaderID].orgID || '',
            viewer: record.viewerID && DrsObj[record.viewerID] || '',
            viewer_org: record.viewerID && relatedOrgsObj[DrsObj[record.viewerID].orgID] || '',
            viewer_orgID: record.viewerID && DrsObj[record.viewerID].orgID || '',
          });
        });
        const start = pageNo - 1 < 0 || !pageNo && 0 || pageNo;
        const filterRes: Array<RECORD_RES> = relatedRecordsRes.filter((recordData: { [key: string]: any }) =>
          (reviewed && recordData.reviewed === reviewed || true) &&
          (minAge && recordData.age >= minAge || true) &&
          (maxAge && recordData.age <= maxAge || true) &&
          (minExamCount && recordData.exam_count >= minExamCount || true) &&
          (maxExamCount && recordData.exam_count <= maxExamCount || true) &&
          (minUploadTime && recordData.uploadTime.getTime() >= new Date(minUploadTime).getTime() || true) &&
          (maxUploadTime && recordData.uploadTime.getTime() <= new Date(maxUploadTime).getTime() || true) &&
          (uploaderSites && uploaderSites.length > 0 && uploaderSites.indexOf(recordData.uploader_orgID) >= 0 || true) &&
          (viewerSites && viewerSites.length > 0 && viewerSites.indexOf(recordData.viewer_orgID) >= 0 || true) &&
          (viewers && viewers.length > 0 && viewers.indexOf(recordData.viewerID) >= 0 || true) &&
          (aiDiags && aiDiags.length > 0 && aiDiags.filter((disName: string) => recordData.ai_disease[disName]).length > 0 || true) &&
          (drDiags && drDiags.length > 0 && drDiags.filter((disName: string) => recordData.doctor_disease[disName]).length > 0 || true)
        ).map((recordData: { [key: string]: any }): RECORD_RES => ({
          id: recordData.id,
          pid: recordData.pid,
          examTime: recordData.examTime.toISOString().slice(0, 10),
          diagnosis: 0,
          ai_disease: recordData.ai_disease.slice(0, 2).map((disRes: { [key: string]: number | boolean | string }) => {
            const [key] = Object.keys(disRes);
            let [val] = Object.values(disRes);
            if (typeof val === 'number') {
              val = parseInt(val.toString().split('').sort((a: string, b: string) => parseInt(b) - parseInt(a)).slice(0, 2).join(''));
            }
            return { [key]: val };
          }),
          doctor_disease: recordData.doctor_disease.slice(0, 2).map((disRes: { [key: string]: number | boolean | string }) => {
            const [key] = Object.keys(disRes);
            let [val] = Object.values(disRes);
            if (typeof val === 'number') {
              val = parseInt(val.toString().split('').sort((a: string, b: string) => parseInt(b) - parseInt(a)).slice(0, 2).join(''));
            }
            return { [key]: val };
          }),
          age: recordData.age,
          birthday: recordData.birthday.toISOString().slice(0, 10),
          checkTime: recordData.checkTime.toISOString().slice(0, 10),
          exam_count: recordData.exam_count,
          gender: recordData.gender,
          mobile: recordData.mobile,
          name: recordData.name,
          reviewed: recordData.reviewed,
          uploadTime: recordData.uploadTime.toISOString().slice(0, 10),
          uploader: recordData.uploader.name,
          uploader_site: recordData.uploader_org.name,
          viewer: recordData.viewer.name,
          viewer_site: recordData.viewer_org.name,
        })).slice(start, start * pageSize + pageSize);
        res.statusCode = 200;
        res.json({
          data: filterRes,
          searchId: searchId || '1',
          pageNo,
          pageSize,
          pushedLen: filterRes.filter((record: RECORD_RES) => record.reviewed === RECORD_STATE.PUSHED),
          reviewLen: filterRes.filter((record: RECORD_RES) => record.reviewed === RECORD_STATE.CREATED),
          reviewedLen: filterRes.filter((record: RECORD_RES) => record.reviewed === RECORD_STATE.REVIEWED),
          totalLen: filterRes.length,
          totalPage: Math.ceil(filterRes.length / pageSize),
          uploader_sites: uploader_orgs || [],
          viewer_doctors: viewUsers || [],
          viewer_sites: viewer_orgs || [],
          status: 200,
          error_message: '',
        });
      }
      res.statusCode = 500;
      res.json({
        data: [],
        searchId: searchId || '1',
        pageNo,
        pageSize,
        pushedLen: 0,
        reviewLen: 0,
        reviewedLen: 0,
        totalLen: 0,
        totalPage: 0,
        uploader_sites: [],
        viewer_doctors: [],
        viewer_sites: [],
        status: 500,
        error_message: 'Not found the uer info in back-end;'
      });

    });
  },

  getRecord: (req: Request, res: Response) => {

  },
}