import fs from 'fs';
import path from 'path';

const RECORD_STATUS = {
  NEW: 'NEW',
  CALCING: 'CALCING',
  REVIEWED: 'REVIEWED',
  PUSH: 'PUSH',
  PUSHED: 'PUSHED',
};

const DIAGS_TYPES = {
  AI: 'AI',
  DOCTOR: 'doctor',
};

const TAB_GROUPS = {
  OTHER_RESULTS: 'OTHER_RESULTS',
  RECORD_NOTE: 'RECORD_NOTE',
  HISTORY: 'HISTORY',
  SELF_EXPLAN: 'SELF_EXPLAN',
  PATIENT_OTHER_INFO: 'PATIENT_OTHER_INFO',
};

const exists = {};
const patientes = [];
const sites = [];
const records = [];
const photos = [];
const users = [];
// const mapTabs = {};

const MATERIAL = path.join(__dirname, './fakeData/json/material.json');
const PATINETS = path.join(__dirname, './fakeData/json/patients.json');
const RECORDS = path.join(__dirname, './fakeData/json/records.json');
const PERMISSION = path.join(__dirname, './fakeData/json/permission.json');
const USERS = path.join(__dirname, './fakeData/json/user.json');
const SITES = path.join(__dirname, './fakeData/json/hospitalSites.json');
const LESIONS = path.join(__dirname, './fakeData/json/lesions.json');
// const DIAGS = path.join(__dirname, './fakeData/json/diags.json');
const DISEASES = path.join(__dirname, './fakeData/json/diseases.json');
const PHOTOS = path.join(__dirname, './fakeData/json/photos.json');
const IMGPATHS = path.join(__dirname, './fakeData/json/imgPaths.json');
const TABS = path.join(__dirname, './fakeData/json/tabs.json');

const guid = (len = 32) => {
  let temp = 'd';
  for (let n = 0; n < len; n++) {
    temp += parseInt(Math.random() * 2, 10) < 1 ? 'd' : 'f';
  }
  return temp.replace(/[df]/g, (c) => {
    const r = parseInt(Math.random() * 16, 10);
    const v = c === 'd' ? r : (Math.ceil(r / 3) + 8);
    return v.toString(16);
  });
};
const randomNum = (max, min = 0) => parseInt(Math.random() * max + min, 10);

