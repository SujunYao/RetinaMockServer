export enum APP_VERSION {
  ALL = 'all',
  DR = 'dr',
}

export enum SIDES {
  LEFT = 1,
  RIGHT = 0,
}

export enum TPL_GROUPS {
  HISTORY = 'HISTORY',            // 病史分组名
  OT_RES = 'OT_RES',              // 其他检查结果分组名
  SELF_EXPLAN = 'SELF_EXPLAN',    // 主诉(患者自我描述症状)分组名
  RECORD_NODE = 'RECORD_NOTE',    // 检查备注
}

export enum MARK_SHAPE {
  CRICLE = 'Circle',
  RECT = 'Rect'
}

export enum MEASURES {
  ART = 'art_ratio',
  DISK_CUP = 'disk_cup_ratio',
  CUSTOM_CUP = 'custom_ratio',
}

export enum PHOTO_QUALITY {
  BAD = 1,
  NORMAL = 2,
  GOOD = 3,
  NO_CALC = -1,
  NOT_APPLICABLE = -2,
}

export enum INTERVAL {
  ONE_YEAR = 0,                    // 1年后复查
  SIX_MONTH = 1,                   // 6个月后复查
  FIX_TIEM = 3,                    // 定期复查
  CUSTOM = -1,                     // 自定义间隔月数
  DEFAULT = -1,                    // 默认/未完成计算
}

export enum TRANSFER_MODE {
  NORMAL = 0,                      // 常规随诊
  NON_EMERGENCY = 1,               // 非紧急转诊
  EMERGENCY = 2,                   // 紧急转诊
}

export enum TRANSFER_MODE_EXTEND {
  DEFAULT = -1,                  // 默认/未完成计算
  NONE = 0,                      // 常规随诊
  IN_HOSPITAL = 1,               // 院内转诊
  OUT_OF_HOSPITAL = 2,           // 院外转诊
}

export enum GENDER {
  MALE = 'M',
  FEMALE = 'F',
  OTHER = 'O',
}

export enum RECORD_STATE {
  CREATED = 0,                      // 未阅片
  CALCING = 1,                      // 计算中
  REVIEWED = 2,                     // 已阅片
  PUSHED = 3,                       // 已推送
}

export enum ROLE {
  DR = 'doctor',
  ORG_AD = 'org_admin',
  SYS_AD = 'sys_admin',
  SUP_AD = 'super_admin',
}

export enum OPERATION_PERMISSIONS {
  ADMIN = 'admin',                    // 管理权限
  PATIENT_AD = 'patient_admin',       // 患者管理权限
  REVIEWED_RD = 'post_exam',          // 阅片权限
  PUSH_RD = 'push_exam',              // 推送权限
  TRANSFER_RD = 'transfer_exam',      // 转诊权限
  AUDIT_TRANSFER = 'review_transfer'  // 转诊审核权限
}

export enum MODULE_PERMISSIONS {
  HISTORY_INFO = 'history_info',        // 病史信息模块
  QUALITY_CONTROL = 'quality_control',  // 眼片质量控制
  R_TRANSFER_MODE = 'recom_transfer',   // 推荐转诊模式
  R_REVISIT_INTERVAL = 'recom_reexam',  // 推荐复查时间间隔计算
  COMMENT = 'comment',                  // 注释? TODO: 目前未使用? 
  ENA_MEASURE = 'isMeasureEnable',      // 图像分析辅助线,比值线
  EXP_REPORT = 'report_preview',        // 导处报告
  MARKS = 'markers',                    // 遮罩层
  LESION = 'lesion',                  // 图像所见疾病列表配置
  DISEASE = 'disease',                  // 疾病分析列表配置
}

export enum MEASURE_LINES {
  MACULA = 'macula_line',               // 黄斑辅助线
  DISK = 'disk_line',                   // 视盘辅助线
  CUP_DISK = 'cup_disk_mask',           // 杯盘分割
  ART = 'art_mask',                     // 动静脉mask
  LESION = 'lesion_mask',              // 病灶检测mask
}

export enum MARKERS {                          // TODO: on use? removed?
  MARKERS_DISPLAY = 'markers_display',
  MODEL_DETECTION = 'model_detection',
}

export enum BOOLEAN_STATE {
  TRUE = 1,
  FALSE = 0,
}

export enum CHECKBOX_MODE {
  NONE = 0,                             // 无
  SINGLE = 1,                           // 单选
  MULTI = 2,                            // 多选
}

export enum AREA {
  NONE = 0,                             // 无
  VASCULAR_LESION = 1,                  // 视网膜病变
  RETINAL_LESION = 2,                  // 血管性病变
  OPTIC_NEUROPATHY = 3,                 // 视神经病变
}

export enum LESIONS {
  MA = 'ma',                            // 微血管瘤
  HMA = 'hma',                          // 视网膜内出血
  HE = 'he',                            // 硬性渗出,
  CW = 'cw',                            // 棉絮斑,
  DS = 'ds',                            // 玻璃膜疣,
  AN = 'an',                            // 动静脉交叉压迹,
  TAF = 'taf',                          // 豹纹状眼底,
  NVFP = 'nvfp',                        // 新生血管或增殖膜,
  PVH = 'pvh',                          // 视网膜前出血或玻璃体积血,
  LS = 'ls',                            // 激光斑,
  IRMA = 'IRMA',                        // IRMA,
  VB = 'vb',                            // 静脉串珠样改变,
  ODE = 'ode',                          // 视盘水肿,
  AQO = 'awo',                          // 血管反光增强,
  GEA = 'gea',                          // 地图样萎缩,
  SP = 'sp',                            // 后巩膜葡萄肿,
  AAVR = 'aavr',                        // 动静脉比异常,
  ACDR = 'acdr',                        // 杯盘比异常,
  PD = 'pd',                            // 色素改变,
  SH = 'sh',                            // 视网膜下出血,
  SEH = 'seh',                          // 色素上皮下出血,
  RD = 'rd',                            // 视网膜脱离,
  MC = 'mc',                            // 近视弧形斑,
  FS = 'fs',                            // Fuch斑,
  LC = 'lc',                            // 漆裂纹,
  CA = 'ca',                            // 脉络膜视网膜萎缩,
}

export enum DISEASES {
  DR = 'DR',                            // 糖网,
  CSME = 'CSME',                        // 糖尿病黄斑水肿,
  AMD = 'amd',                          // 年龄相关性黄斑变性,
  HR = 'hr',                            // 高血压性视网膜病变,
  PM = 'pm',                            // 病理性近视,
  MO = 'mo',                            // 屈光介质不清,
  GA = 'ga',                            // 青光眼(疑似),
  RVO = 'rvo',                          // 视网膜血管阻塞,
  OT = 'other',                         // 其他,
}