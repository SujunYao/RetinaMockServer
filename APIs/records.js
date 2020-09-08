const fs = require('fs');
const path = require('path');

const RECORD_STATUS = {
  NEW: 'NEW',
  REVIEWED: 'REVIEWED',
  CALCING: 'CALCING',
  PUSH: 'PUSH',
  PUSHED: 'PUSHED',
};
const RES_TYPE = {
  DOCTOR: 'DOCTOR',
  AI: 'AI',
};
const filterList = [
  RECORD_STATUS.NEW, RECORD_STATUS.CALCING, RECORD_STATUS.REVIEWED, RECORD_STATUS.PUSHED];
const SYS = path.join(__dirname, './fakeData/json/sys.json');
const PATINETS = path.join(__dirname, './fakeData/json/patients.json');
const RECORDS = path.join(__dirname, './fakeData/json/records.json');
const USERS = path.join(__dirname, './fakeData/json/user.json');
const SITES = path.join(__dirname, './fakeData/json/hospitalSites.json');
const DIAGS = path.join(__dirname, './fakeData/json/diags.json');
const PHOTOS = path.join(__dirname, './fakeData/json/photos.json');
const TABS = path.join(__dirname, './fakeData/json/tabs.json');
const DISEASES = path.join(__dirname, './fakeData/json/diseases.json');

const diseases = JSON.parse(fs.readFileSync(DISEASES, 'utf8'));

const diseasesObj = {};
diseases.forEach((dis) => {
  if (!dis.parent) {
    diseasesObj[dis.key] = dis;
  } else if (diseasesObj[dis.parent]) {
    if (!diseasesObj[dis.parent].children) {
      diseasesObj[dis.parent].children = [];
    }
    diseasesObj[dis.parent].children.push(dis);
  }
});

const calcDisChildsRes = (dises) => {
  if (typeof dises !== 'number') {
    return false;
  }
  const strs = dises.toString();
  let i = strs.length;
  let result = 0;
  do {
    if (!result || parseInt(strs[i], 10) > result) {
      result = parseInt(strs[i], 10);
    }
    i -= 1;
  } while (i >= 0);
  return result;
};

const calcDisRes = (record, type, isList = false, isAll = false) => {
  const disease = {};
  Object.values(record.diseasesRes).forEach((sideInfo) => {
    Object.entries(sideInfo).forEach(([disKey, dis]) => {
      let disRes = '';
      if (type && dis.type === RES_TYPE.AI) {
        disRes = dis.AI;
      } else {
        disRes = dis.doctor && (dis.doctor !== 0 || isList) ? dis.doctor : dis.AI;
      }
      if (disRes && disRes !== 0) {
        switch (typeof disRes) {
          case 'boolean':
            disease[disKey] = disRes;
            break;
          case 'number':
            if (disease[disKey]) {
              const tgtRes = calcDisChildsRes(disRes);
              if (tgtRes > disease[disKey]) {
                disease[disKey] = tgtRes;
              }
            } else {
              disease[disKey] = disRes;
            }
            break;
          default:
            break;
        }
      }
    });
  });
  const finalReturn = Object.entries(disease)
    .sort(([keya], [keyb]) => diseasesObj[keya].index - diseasesObj[keyb].index)
    .map(([key, disRes]) => ({ [key]: disRes }));
  return (isAll && finalReturn) || finalReturn.slice(0, 2);
};

module.exports = {
  getRecords: (req, res) => {
    const records = JSON.parse(fs.readFileSync(RECORDS, 'utf8'));
    const users = JSON.parse(fs.readFileSync(USERS), 'utf8');
    const sites = JSON.parse(fs.readFileSync(SITES), 'utf8');
    const patients = JSON.parse(fs.readFileSync(PATINETS), 'utf8');
    const diags = JSON.parse(fs.readFileSync(DIAGS), 'utf8');
    const mapDiags = {};
    diags.forEach((diag) => {
      mapDiags[diag.id] = diag;
    });
    const mapSites = {};
    sites.forEach((site) => {
      mapSites[site.id] = site;
    });
    const mapUsers = {};
    users.forEach((user) => {
      mapUsers[user.id] = user;
    });
    const mapPatients = {};
    patients.forEach((patient) => {
      mapPatients[patient.pid] = patient;
    });
    const { loginUser } = JSON.parse(fs.readFileSync(SYS, 'utf8'));

    let str = '';
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
      const userInfo = mapUsers[loginUser];
      let data = [];
      let pushedLen = 0;
      let reviewLen = 0;
      let reviewedLen = 0;
      let totalLen = 0;
      let totalPage = 0;
      let err = '';
      const upSites = [];
      const reviewers = [];
      const rSites = [];
      if (userInfo) {
        const relatedSites = sites.filter(
          site => site.drs.filter(drID => drID === userInfo.id).length > 0,
        );
        const relatedSitesIDs = relatedSites.map(site => site.id);
        const relatedRecords = records.filter(
          record => (relatedSitesIDs.indexOf(record.uploaderSiteID) >= 0
            || (record.viewerSiteID && relatedSitesIDs.indexOf(record.viewerSiteID) >= 0)),
        );
        const curTabRecords = relatedRecords.filter(
          record => ((reviewed
            && (reviewed.indexOf(filterList.indexOf(record.status)) >= 0
              || (record.status === RECORD_STATUS.PUSH && reviewed.indexOf(2) >= 0))) || !reviewed)
            && (((minAge && mapPatients[record.pid].age >= minAge) || !minAge)
              && ((maxAge && mapPatients[record.pid].age <= maxAge) || !maxAge))
            && (((minExamCount
              && relatedRecords.filter(item => item.pid === record.pid).length >= minExamCount)
              || !minExamCount)
              && ((maxExamCount
                && relatedRecords.filter(item => item.pid === record.pid).length <= maxExamCount)
                || !maxExamCount))
            && (((minUploadTime
              && +new Date(record.uploadTime) >= +new Date(minUploadTime)) || !minUploadTime)
              && ((maxUploadTime
                && +new Date(record.uploadTime) <= +new Date(maxUploadTime)) || !maxUploadTime))
            && ((uploaderSites
              && uploaderSites.indexOf(record.uploaderSiteID) >= 0) || !uploaderSites)
            && ((viewerSites
              && viewerSites.indexOf(record.viewerSiteID) >= 0) || !viewerSites)
            && ((viewers && viewers.indexOf(record.viewerID) >= 0) || !viewers)
            // eslint-disable-next-line max-len
            && ((aiDiags && calcDisRes(record, RES_TYPE.AI, true, true).filter(dis => aiDiags.indexOf(Object.keys(dis)[0]) >= 0).length > 0) || !aiDiags)
            // eslint-disable-next-line max-len
            && ((drDiags && calcDisRes(record, RES_TYPE.DOCTOR, true, true).filter(dis => drDiags.indexOf(Object.keys(dis)[0]) >= 0).length > 0) || !drDiags),
        );
        const up = {};
        const r = {};
        relatedRecords.forEach((record) => {
          if (!up[record.uploaderSiteID]) {
            up[record.uploaderSiteID] = record.uploaderSiteID;
            upSites.push({
              id: mapSites[record.uploaderSiteID].id,
              name: mapSites[record.uploaderSiteID].name,
              admin: mapUsers[mapSites[record.uploaderSiteID].admin].username,
            });
          }
          if (!r[record.viewerSiteID] && record.viewerSiteID) {
            r[record.viewerSiteID] = record.viewerSiteID;
            rSites.push({
              id: mapSites[record.viewerSiteID].id,
              name: mapSites[record.viewerSiteID].name,
              admin: mapUsers[mapSites[record.viewerSiteID].admin].username,
            });
            mapSites[record.viewerSiteID].drs.forEach((drID) => {
              if (!r[drID]) {
                reviewers.push({
                  user_id: drID,
                  name: mapUsers[drID].name,
                  username: mapUsers[drID].username,
                  org_name: mapSites[record.viewerSiteID].name,
                });
              }
            });
          }
        });
        data = curTabRecords.slice((pageNo - 1) * pageSize, (pageNo - 1) * pageSize + pageSize)
          .map(record => ({
            age: mapPatients[record.pid].age,
            ai_disease: calcDisRes(record, RES_TYPE.AI, true),
            // eslint-disable-next-line max-len
            doctor_disease: ((record.status === RECORD_STATUS.NEW || record.status === RECORD_STATUS.CALCING) && []) || calcDisRes(record, RES_TYPE.DOCTOR, true),
            birthday: mapPatients[record.pid].birthday,
            checkTime: record.checkTime,
            examTime: record.examTime,
            exam_count: relatedRecords.filter(item => item.pid === record.pid).length,
            gender: mapPatients[record.pid].gender,
            id: record.id,
            mobile: mapPatients[record.pid].mobile,
            name: mapPatients[record.pid].name,
            pid: record.pid,
            reviewed: filterList.indexOf(record.status),
            uploadTime: record.uploadTime,
            uploader: mapUsers[record.uploaderID].username,
            uploader_site: mapSites[record.uploaderSiteID].name,
            viewer: record.viewerID && mapUsers[record.viewerID].username,
            viewer_site: record.viewerSiteID && mapSites[record.viewerSiteID].name,
          }));
        pushedLen = relatedRecords.filter(record => record.status === RECORD_STATUS.PUSHED).length;
        reviewLen = relatedRecords.filter(record => record.status === RECORD_STATUS.NEW).length;
        reviewedLen = relatedRecords.filter(
          record => record.status === RECORD_STATUS.REVIEWED,
        ).length;
        totalLen = curTabRecords.length;
        totalPage = Math.ceil(totalLen / pageSize);
      } else {
        res.statusCode = 500;
        err = 'No user logined in back-end!!!';
      }

      res.json({
        data,
        searchId,
        pageNo,
        pageSize,
        pushedLen,
        reviewLen,
        reviewedLen,
        totalLen,
        totalPage,
        uploader_sites: upSites || [],
        viewer_doctors: reviewers || [],
        viewer_sites: rSites || [],
        status: 200,
        error_message: err,
      });
    });
  },
  getRecord: (req, res) => {
    const recordID = req.query.id;
    const records = JSON.parse(fs.readFileSync(RECORDS, 'utf8'));
    const users = JSON.parse(fs.readFileSync(USERS), 'utf8');
    const sites = JSON.parse(fs.readFileSync(SITES), 'utf8');
    const patients = JSON.parse(fs.readFileSync(PATINETS), 'utf8');
    const diags = JSON.parse(fs.readFileSync(DIAGS), 'utf8');
    const photos = JSON.parse(fs.readFileSync(PHOTOS), 'utf8');
    const tabs = JSON.parse(fs.readFileSync(TABS), 'utf8');
    const mapTabs = {};
    tabs.forEach((tab) => {
      if (tab.parent) {
        if (!mapTabs[tab.parent].childs) mapTabs[tab.parent].childs = [];
        mapTabs[tab.parent].childs.push(tab);
      } else {
        mapTabs[tab.id] = tab;
      }
    });
    const mapPhotos = {};
    photos.forEach((photo) => {
      mapPhotos[photo.id] = photo;
    });
    const mapDiags = {};
    diags.forEach((diag) => {
      mapDiags[diag.id] = diag;
    });
    const mapSites = {};
    sites.forEach((site) => {
      mapSites[site.id] = site;
    });
    const mapUsers = {};
    users.forEach((user) => {
      mapUsers[user.id] = user;
    });
    const mapPatients = {};
    patients.forEach((patient) => {
      mapPatients[patient.pid] = patient;
    });
    const tgtRecord = records.filter(record => record.id === recordID).slice(-1).pop();
    let errorMessage = '';
    if (!tgtRecord) {
      res.statusCode = 500;
      errorMessage = `Could not fount the record with id '${recordID}' in records.json`;
    }
    const tgtPatient = patients.filter(patient => patient.pid === tgtRecord.pid).slice(-1).pop();
    if (!tgtPatient) {
      res.statusCode = 500;
      errorMessage = `Could not fount the patient info with id '${tgtRecord.pid}' in patients.json`;
    }
    if (res.statusCode === 500) {
      res.json({
        status: res.statusCode,
        error_message: errorMessage,
      });
    } else {
      const [uploader] = users.filter(user => user.id === tgtRecord.uploaderID);
      const [uploadSite] = sites.filter(site => site.id === tgtRecord.uploaderSiteID);
      let viewer = null;
      if (tgtRecord.viewerID) {
        [viewer] = users.filter(user => user.id === tgtRecord.viewerID);
      }
      const recordsForTgtPatient = records.filter(record => record.pid === tgtPatient.pid);
      const recordsForTgtPatientMap = recordsForTgtPatient.map(record => ({
        id: record.id,
        disease: calcDisRes(record),
        examTime: record.checkTime,
        history_info: {
          main: record.selfExplan.map(tabID => mapTabs[tabID].name),
          exam: record.otherResults.map(tabID => mapTabs[tabID].name),
          history: record.histories.map(tabID => mapTabs[tabID].name),
          exam_info: record.notes.map(tabID => mapTabs[tabID].name),
        },
      }));
      const leftEye = {};
      const rightEye = {};
      tgtRecord.photoIDs.forEach((photoID) => {
        const photo = mapPhotos[photoID];
        switch (mapPhotos[photoID].side) {
          case 1:
            if (tgtRecord.status === RECORD_STATUS.NEW) {
              Object.keys(photo.lesion).forEach((key) => {
                photo.lesion[key].doctor = photo.lesion[key].AI;
              });
            }
            leftEye[photoID] = photo;
            break;
          case 0:
            if (tgtRecord.status === RECORD_STATUS.NEW) {
              Object.keys(photo.lesion).forEach((key) => {
                photo.lesion[key].doctor = photo.lesion[key].AI;
              });
            }
            rightEye[photoID] = photo;
            break;
          default:
            break;
        }
      });
      res.json({
        patient: {
          id: tgtRecord.id,
          pid: tgtPatient.pid,
          name: tgtPatient.name,
          age: tgtPatient.age,
          birthday: tgtPatient.birthday,
          patient_id: tgtPatient.mobile,
          mobile: tgtPatient.mobile,
          gender: tgtPatient.gender,
          uploader: uploader && uploader.username,
          uploader_site: uploadSite && uploadSite.name,
          checkTime: tgtRecord.checkTime,
          viewer: viewer && viewer.username,
          exam_count: recordsForTgtPatient.length,
          disease: calcDisRes(tgtRecord),
        },
        photo: {
          left_eye: leftEye,
          right_eye: rightEye,
        },
        disease: tgtRecord.diseasesRes,
        // other_disease: {
        //   left_eye: {},
        //   right_eye: {
        //     cat: { id: 'cat', AI: 1, doctor: 12 },
        //     dr: { id: 'dr', AI: 1, doctor: 0 },
        //     ga: { id: 'ga', AI: false, doctor: true },
        //   },
        // },
        recom_transfer: { // (转诊建议，参数对应是{0:'常规随诊',1:'非紧急转诊',2:'紧急转诊'})
          doctor: [-1],
          AI: [-1],
        },
        transfer_extended: {
          // (参数对应{ 0: '无', 1: '院内转诊', 2: '院外转诊' }，AI未计算完成时默认值[-1], 医生未勾选默认值[-1],)
          doctor: [-1],
          AI: [-1],
        },
        recom_reexam: {
          // eslint-disable-next-line max-len
          // (复查建议,第一个参数对应复查级别{0:'1年后复查',1:'6个月后复查',2:'3个月后复查',3:'定期复查'} 对于医生自定义的月数，格式为[-1,月数],未计算完成时AI和医生的默认值都是[-1])
          AI: [-1],
          doctor: [-1],
        },
        comment: '',
        history_info: {
          main: tgtRecord.selfExplan.map(tabID => mapTabs[tabID].name),
          exam: tgtRecord.otherResults.map(tabID => mapTabs[tabID].name),
          history: tgtRecord.histories.map(tabID => mapTabs[tabID].name),
          patient_info: tgtPatient.other_info.map(info => `${info.fieldName}: ${info.fieldValue}`),
          exam_info: tgtRecord.notes.map(tabID => mapTabs[tabID].name),
        },
        history_diabet: false,
        reviewed: filterList.indexOf(tgtRecord.status),
        status: 200,
        error_message: errorMessage,
        updateInfo: {
          lastUpdateTime: tgtRecord.viewerID && tgtRecord.updateTime,
          reviewer: viewer && viewer.username,
        },
        exam_list: recordsForTgtPatientMap,
      });
    }
  },
};
