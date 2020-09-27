// import './enum';
import { LESIONS, DISEASES, CHECKBOX_MODE, BOOLEAN_STATE, AREA, MODULE_PERMISSIONS, MEASURE_LINES, MARKERS, OPERATION_PERMISSIONS, GENDER, ROLE, RECORD_STATE, MARK_SHAPE, MEASURES, PHOTO_QUALITY, INTERVAL, TRANSFER_MODE, TRANSFER_MODE_EXTEND, APP_VERSION, } from './enum';
/**
 * interfaces for the common template;
 * @Sujun
 * **/

export interface COUNT {
  [key: string]: number
}
export interface BOOLEAN {
  [key: string]: boolean
}

export interface CACHE {
  ORG_ADMIN_COUNT: COUNT,
  ORG_EXTEND: BOOLEAN,
  ORG_PATIENT_MAX: COUNT,
}

export interface HISTORY_TPL {
  id: string,
  priority: string,
  valueType: string,
  unit: string,
  name: string,
  parent: string,
  group: string,
  childs?: Array<HISTORY_TPL>
  val?: string,
  selChildID?: string,
  template_id: number,
}

export interface HISTORY_INFO_TEMPLATE_SUBITEM_D {
  value: string | number,
  unit?: string,
}

export interface HISTORY_INFO_TEMPLATE_PARAM {
  sub_item?: string,
  data: HISTORY_INFO_TEMPLATE_SUBITEM_D
}

export interface HISTORY_INFO_TEMPLATE {
  field_name?: string,
  template_id: number,
  para?: HISTORY_INFO_TEMPLATE_PARAM,
}

export interface RESULT {
  AI: string | number | boolean,
  doctor: string | number | boolean,
}

export type DIS_RESULT = {
  [key in DISEASES]?: number | boolean | string
}

export interface BOX {
  centerPoint: { x: number, y: number },
  radius?: number,
}

export interface POINT {
  x: number,
  y: number,
}

export interface RATOR {
  metaId: string,
  startPoint: POINT,
  endPoint: POINT,
  color: string,
  shape: string,
  auxiliaryLines?: Array<{
    startPoint: POINT,
    endPoint: POINT,
  }>
}

export interface CONFIG_LESION {
  id: LESIONS | string,
  is_display: boolean,
  isSupport: boolean,
  checkbox: CHECKBOX_MODE,
  area: AREA,
  dr_related: BOOLEAN_STATE,
  amd_related: BOOLEAN_STATE,
  hr_related: BOOLEAN_STATE,
  pm_related: BOOLEAN_STATE,
}

export interface CONFIG_DISEASE {
  id: DISEASES | string,
  is_display: boolean,
  isSupport: boolean,
  checkbox: CHECKBOX_MODE,
}

export interface CONFIG_MODULE_ITEM {
  id: MODULE_PERMISSIONS | MEASURE_LINES | MARKERS | string,
  is_display?: boolean,
  name?: MARKERS | string,
  is_extended?: boolean,  // 天津四特别扩展开关
  detail?: Array<CONFIG_MODULE_ITEM | CONFIG_LESION | CONFIG_DISEASE>,
}

export type CONFIG = {
  [key in MODULE_PERMISSIONS]: CONFIG_MODULE_ITEM
}

export type PERMISSION = {
  [key in OPERATION_PERMISSIONS]: boolean;
};

export interface PATH_INFO {
  big: string,
  small: string,
  width: number,
  height: number,
  cup_disk_mask: string,
  size: number
}


/**
 * interfaces for the JSON data(./MockData/*.json);
 * @Sujun
 * **/

export interface PATIENT_OT_INFO { } // TODO: remove?

export interface DEVICE_DATA {
  id: string,
  name: string,
  orgID: string,
  factory: string,                          // 设备厂商
  model: string,                            // 设备型号
  is_enabled: boolean,                      // 设备可用状态
  exposureRange: string,                    // 角度
  storageFormat: string,                    // 存储格式
}

export interface ORG_DATA {
  id: string,
  name: string,
  address: string,
  parentID: string,
  authorizedOrgIDs: Array<string>,
  logo: string,
  logo_name: string,
  disclaimer: string,
  authorized: Array<string>,
}

export interface HISTORY_INFO_DATA {
  [key: string]: Array<HISTORY_INFO_TEMPLATE>,
  main: Array<HISTORY_INFO_TEMPLATE>,          // 主诉
  exam: Array<HISTORY_INFO_TEMPLATE>,          // 其他检查结果(来自用户输入,非数据库)
  history: Array<HISTORY_INFO_TEMPLATE>,       // 病史
  exam_info: Array<HISTORY_INFO_TEMPLATE>,     // 检查备注(住院/门诊, 自费/医保)
}

export interface PATIENT_DATA {
  id: string,
  mobile: string,
  name: string,
  birthday: Date,
  history: HISTORY_INFO_DATA,             // 病史信息
  ID_number: string,                      // 身份证号
  clinic_card_id: string,                 // 就诊卡号
  social_security_id: string,             // 社保卡号
  inpatient_id: string,                   // 住院号
  gender: GENDER,
  createdBy: string,
  has_deleted: BOOLEAN_STATE,
  other_info: PATIENT_OT_INFO | string,   // TODO: whether used? remove?
  create_time: Date,                      // 创建时间
  update_time: Date,                      // 更新时间
}

export interface USER_DATA {
  id: string,
  userName: string,
  name: string,
  password: string,
  appMode?: APP_VERSION,
  role: ROLE,
  permission: PERMISSION,
  config: CONFIG,
  orgID: string,
}

export interface RECORD_DATA {
  id: string,
  pid: string,
  examTime: Date,
  diagnosis?: number,
  photoIDs: Array<number>,
  disease?: { [key in DISEASES]?: RESULT | string },
  // doctor_disease?: Array<DIS_RESULT>,
  checkTime?: Date | string,
  push: boolean,
  reviewed?: RECORD_STATE,
  patientCreatedBy: string,
  uploadTime?: Date,
  uploaderID?: string,
  uploaderORGID?: string,
  viewerID?: string,
  viewerORGID?: string,
}

export interface DISEASE_DATA {
  id: string,
  key: string,
  checkbox: CHECKBOX_MODE,
  parent: string,
  childs?: Array<DISEASE_DATA>,
  index: number,
}

export interface LESION_DATA {
  id: string,
  key: string,
  checkbox: CHECKBOX_MODE,
  parent: string,
  desc: string,
  childs?: Array<LESION_DATA>,
  index: number,
}

export interface PHOTO_DATA {
  ai_markers: []
  art_mask: string,
  art_ratio: RESULT,
  brightness: number
  contrast: number,
  cup_disk_mask: string,
  cup_disk_ratio: RESULT
  diskBox: BOX | {},
  filesize: string,
  height: number,
  id: number,
  imageUrl: string,
  maculaBox: BOX | {},
  markers: Array<MARKER_RES>
  measureData: MEASUER_RES,
  px_ratio: number,
  side: number,
  thumbUrl: string,
  lesions: LESION_RES,
  width: number,
  quality: PHOTO_QUALITY,
  recordID: string,
}

/**
 * interfaces for the response data;
 * @Sujun
 * **/

export interface HISTORY_INFO_BRIEFLY_RES {
  main: string | Array<string>,
  exam: string | Array<string>,
  history: string | Array<string>,
  exam_info: string | Array<string>,
  history_text: string | Array<string>,
  patient_info: string | Array<string>,
}

export interface HISTORY_INFO_RES {
  main: Array<HISTORY_INFO_TEMPLATE>,          // 主诉 ?? Discarded ??
  exam: Array<HISTORY_INFO_TEMPLATE>,          // 检查
  history: Array<HISTORY_INFO_TEMPLATE>,       // 病史
  exam_info: Array<HISTORY_INFO_TEMPLATE>,     // 检查备注(住院/门诊, 自费/医保)
  history_text: string,                        // 病史整理输出文本 TODO? why?
  patient_info: Array<HISTORY_INFO_TEMPLATE>,  // 患者信息(住院号/社保号/身份证号/就诊卡号)
}

export interface MARKER_RES {
  metaId: string,
  startPoint: POINT,
  endPoint: POINT,
  color: string,
  shape: MARK_SHAPE,
  type: string,
  comment: string,
}

export type MEASUER_RES = {
  [key in MEASURES]: {
    numerator?: RATOR | {},
    denominator?: RATOR | {},
    denominatorLabel?: string,
    numeratorLabel?: string,
  };
};

export interface LESION_RES {
  [key: string]: RESULT | string
}

export interface PHOTO_RES {
  [key: string]: {
    ai_markers: []
    art_mask: string,
    art_ratio: RESULT,
    brightness: number
    contrast: number,
    cup_disk_mask: string,
    cup_disk_ratio: RESULT
    diskBox: BOX,
    filesize: string,
    height: number,
    id: number,
    imageUrl: string,
    lesion: LESION_RES,
    maculaBox: BOX,
    markers: Array<MARKER_RES>
    measureData: MEASUER_RES,
    px_ratio: number,
    quality_control: PHOTO_QUALITY,
    side: number,
    thumbUrl: string,
    width: number,
  }
}

export interface PHOTO_MAIN_RES {
  left_eye: PHOTO_RES
  right_eye: PHOTO_RES
}

export interface PHOTO_BRIEFLY_RES {
  id: number, // TODO export type is ok? 
  thumbUrl: string,
}

export interface PHOTO_MAIN_BRIEFLY_RES {
  left_eye: Array<PHOTO_BRIEFLY_RES>
  right_eye: Array<PHOTO_BRIEFLY_RES>
}

export interface RECOR_DETIAL_RES {
  comment: string,
  disease: {
    left_eye: DIS_RESULT,
    right_eye: DIS_RESULT,
  },
  exam_list: Array<RECORD_RES>,
  history_diabet: boolean, // 此检查的患者有无糖尿病史
  reviewed: RECORD_STATE,
  history_info: HISTORY_INFO_BRIEFLY_RES
  patient: PATIENT_RES,
  photo: PHOTO_MAIN_RES,
  recom_reexam: { AI: Array<INTERVAL>, doctor: Array<INTERVAL> },
  recom_transfer: { AI: Array<TRANSFER_MODE>, doctor: Array<TRANSFER_MODE> },
  transfer_extended: { AI: Array<TRANSFER_MODE_EXTEND>, doctor: Array<TRANSFER_MODE_EXTEND> },
  updateInfo: {
    lastUpdateTime: string,
    reviewer: string,
  },
}

export interface RECORD_RES {
  id: string,
  pid: string,
  examTime: string,
  diagnosis?: number,
  photo?: PHOTO_MAIN_BRIEFLY_RES,
  history_info?: HISTORY_INFO_RES,
  ai_disease?: Array<DIS_RESULT>,
  doctor_disease?: Array<DIS_RESULT>,
  age?: number | null,
  birthday?: string,
  checkTime?: string,
  exam_count?: number,
  gender?: GENDER,
  mobile?: string,
  name?: string,
  reviewed?: RECORD_STATE,
  uploadTime?: string,
  uploader?: string,
  uploader_site?: string,
  viewer?: string,
  viewer_site?: string,
}

export interface PATIENT_RES {
  name: string,
  age?: number,
  gender: GENDER,
  mobile: string,
  birthday: string,
  exam_count: number,
  update_time: string,
  ID_number: string,
  social_security_id: string,
  clinic_card_id: string,
  inpatient_id: string,
  has_deleted: number,
  history_info: HISTORY_INFO_RES,
  exam_list: Array<RECORD_RES>
}

export interface USER_RES {
  id: string,
  name: string,
  username: string,
  role: ROLE,
  is_actived: boolean,
  permission: PERMISSION,
  AI_type: string,
  org: string | {
    id: string,
    name: string,
  },
  product_info: Array<{ [key: string]: string }>,
  token: string,
  // doctor_url: string,
  target_server_host: string,
  config: CONFIG,
  transfer_config?: Array<{}>
}

export interface ORG_RES {
  id: string,
  name: string,
  admin: string,                        // TODO: whether has more than 2 admin? confirm with XIAOYAN
}

export interface ORG_TREE_NDOE_ITEM_RES {
  id: string,
  name: string,
}

export interface ORG_TREE_ROOT_ITEM_RES {
  id: string,
  name: string,
  org_list: Array<ORG_TREE_NDOE_ITEM_RES>
}

export interface ORG_TREE_RES {
  name: string,
  org_name: string,
  role: string,
  data: Array<ORG_TREE_ROOT_ITEM_RES>
}

export interface USER_BRIEFLY_RES {
  user_id: string,
  name: string,
  username: string,
  org_name: string,
}

export interface RECORDS_RES {
  data: Array<RECORD_RES>,
  totalLen: number,                       // 数据总长度
  reviewLen: number,                       // 未审核长度
  reviewedLen: number,                     // 已审核长度
  pushedLen: number,                       // 已推送长度
  totalPage: number,                       // 总页数
  pageSize: number,                        // 每页条数
  pageNo: number,                          // 当前页数
  uploader_sites: Array<ORG_RES>,
  viewer_sites: Array<ORG_RES>,
  viewer_doctors: Array<USER_BRIEFLY_RES>,
}

export interface VIEWER_BRIEFLY_RES {
  name: string,
  org_name: string,
  user_id: string,
  username: string,
}

export interface ORG_BRIEFLY_RES {
  name: string,
  id: string,
  admin?: string, // TODO? whether need?
}