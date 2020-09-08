const fs = require('fs');
const path = require('path');

const RECORD_STATUS = {
  NEW: 'NEW',
  REVIEWED: 'REVIEWED',
  PUSH: 'PUSH',
  PUSHED: 'PUSHED',
};

// const PATINETS = path.join(__dirname, './fakeData/json/patients.json');
const RECORDS = path.join(__dirname, './fakeData/json/records.json');
// const PERMISSION = path.join(__dirname, './fakeData/json/permission.json');
// const USERS = path.join(__dirname, './fakeData/json/user.json');
// const SITES = path.join(__dirname, './fakeData/json/hospitalSites.json');

module.exports = {
  push_len: (req, res) => {
    const records = JSON.parse(fs.readFileSync(RECORDS, 'utf8'));
    res.json({
      error_message: '',
      length: records.filter(record => record.status === RECORD_STATUS.PUSH).length,
    });
  },
};
