import path from 'path';
import { Response, Request } from 'express';
import { parseFile } from '@fast-csv/parse';
import { TASK_RES_DATA, TASK_DATA, TASK_SUMMARY_INFO } from '../interfaces';
import { writeToPath } from '@fast-csv/format';
import { TASK_STATUS, TASK_TYPE } from '../enum';
const TASKS = path.resolve(__dirname, '../MockData', 'tasks.csv');


export default {
  getTasks: (req: Request, res: Response) => {
    const pageNo = parseInt(req.param('pageNo'), 10) || 1;
    const pageSize = parseInt(req.param('pageSize'), 10) || 15;
    const tasks: Array<TASK_RES_DATA> = [];
    parseFile(TASKS, { headers: true })
      .on('data', row => tasks.push({
        task_id: parseInt(row.id, 10),
        status: parseInt(row.status, 10),
        task_type: parseInt(row.type, 10),
        filename: row.name,
        file_url: `http://localhost:4600${row.url}`,
        create_time: parseInt(row.createTime, 10),
        update_time: parseInt(row.updateTime, 10)
      }))
      .on('end', () => {
        const startIndex = (pageNo - 1) * pageSize;
        const finsishIndex = (startIndex + pageSize) > 100 ? 100 : (startIndex + pageSize);
        res.json({
          status: 200,
          error_code: 0,
          pageNo,
          pageSize,
          total: tasks.length,
          data: tasks.sort((a: TASK_RES_DATA, b: TASK_RES_DATA) => b.create_time - a.create_time).slice(startIndex, finsishIndex)
        })
      });
  },

  deleteTask: (req: Request, res: Response) => {
    const tasks: Array<TASK_DATA> = [];
    const task_id = req.param('task_id');
    if (task_id) {
      console.log(task_id);
      parseFile(TASKS, { headers: true })
        .on('data', row => {
          if (row.id !== task_id) {
            tasks.push(row);
          }
        })
        .on('end', () => {
          writeToPath(TASKS, tasks, { headers: true })
            .on('error', err => {
              console.error(err);
              res.statusCode = 400;
              res.json({
                status: 400,
                error_code: 2,
                error_message: 'remove task error in backend'
              });
            })
            .on('finish', () => {
              res.json({
                status: 204,
                error_code: 0,
                error_message: '',
              })
              console.log('Done writing tasks.csv');
            });
        });
    } else {
      res.statusCode = 400;
      res.json({
        status: 400,
        error_code: 1,
        error_message: 'Could not found the task id in the request header!'
      });

    }
  },

  upadateTask: (req: Request, res: Response) => {
    const task_id = req.param('task_id');
    let str = '';
    req.on('data', (chunk) => { str += chunk; });
    req.on('end', () => {
      console.log(str);
      if (str && task_id) {
        const { status } = JSON.parse(str);
        const tasks: Array<TASK_DATA> = [];
        if (status === TASK_STATUS.IP || status === TASK_STATUS.CXL) {
          parseFile(TASKS, { headers: true })
            .on('data', row => {
              if (row.id !== task_id) {
                tasks.push(row);
              } else {
                tasks.push({
                  ...row,
                  status,
                });
              }
            })
            .on('end', () => {
              writeToPath(TASKS, tasks, { headers: true })
                .on('error', err => {
                  console.error(err);
                  res.statusCode = 400;
                  res.json({
                    status: 400,
                    error_code: 2,
                    error_message: 'update task error in backend'
                  });
                })
                .on('finish', () => {
                  res.json({
                    status: 201,
                    error_code: 0,
                    error_message: '',
                  })
                  console.log('Done writing tasks.csv');
                });
            });
        } else {
          res.statusCode = 403;
          res.json({
            status: 403,
            err_code: 1,
            error_message: 'set wrong status code for task(only support cacnel and restore)'

          })
        }
      } else {
        res.statusCode = 400;
        res.json({
          status: 400,
          error_code: 0,
          error_message: 'Missing required params(task_id, status)!'
        });
      }
    });
  },

  getSummaryInfo: (req: Request, res: Response) => {
    const pdfSummary: TASK_SUMMARY_INFO = {
      task_type: TASK_TYPE.pdf,
      processing: 0,
      finished: 0,
      interrupted: 0,
      unexpired: 0,
    };
    const dataSummary: TASK_SUMMARY_INFO = {
      task_type: TASK_TYPE.data,
      processing: 0,
      finished: 0,
      interrupted: 0,
      unexpired: 0,
    }
    parseFile(TASKS, { headers: true })
      .on('data', row => {
        if (row.status === `${TASK_STATUS.IP}` || row.status === `${TASK_STATUS.IDLE}`) {
          if (row.type === `${TASK_TYPE.pdf}`) {
            pdfSummary.processing += 1;
          } else {
            dataSummary.processing += 1;
          }
        }
        if (row.status === `${TASK_STATUS.CMPLT}`) {
          if (row.type === `${TASK_TYPE.pdf}`) {
            pdfSummary.finished += 1;
            pdfSummary.unexpired += 1;
          } else {
            dataSummary.finished += 1;
            dataSummary.unexpired += 1;
          }
        }
        if (row.status === `${TASK_STATUS.INTRPT}`) {
          if (row.type === `${TASK_TYPE.pdf}`) {
            pdfSummary.interrupted += 1;
          } else {
            dataSummary.interrupted += 1;
          }
        }
      })
      .on('end', () => {
        res.json({
          status: 200,
          error_code: 0,
          error_message: '',
          data: [pdfSummary, dataSummary]
        });
      });
  }
}