export default {
  title: 'Simple Production Routing Management',
  menu: '選單',
  logout: '登出',
  actions: {
    action: '動作',
    add: '新增',
    edit: '編輯',
    delete: '刪除',
    cancel: '取消',
    confirm: '確定',
    inserts: {
      success: '新增成功',
    },
  },
  base: {
    creator: '建立者',
    modifier: '修改者',
    createDate: '建立日期',
    modifiedDate: '修改日期',
  },
  parts: {
    title: '料件管理',
    caption: '管理料件以及其他關連',
    part: '料件',
    routing: '產品途程',
    number: '料號',
    name: '料件名稱',
    endItem: '最終項目',
    phantom: '虛擬件',
    view: 'View',
    views: {
      design: '設計',
      manufacturing: '製造',
    },
    new: '新增料件',
  },
  customs: {
    title: '自定義',
    caption: '管理自訂屬性',
    attributes: {
      title: '自定義屬性',
      caption: '設定您的自定義屬性',
    },
  },
  iterable: {
    version: '版本',
    iteration: '迭代版本',
    revision: '修訂版本',
    checkout: '出庫',
  },
  validations: {
    parts: {
      notNull: '不可為空',
      shorterThan3: '字數不可少於3',
      longerThan50: '字數不可大於50',
      invalidChar: '只能含有0-9、aA-zZ、-、_',
    },
  },
  source: '來源',
  unit: '單位',
  remarks: '備註',
  lang: {
    zhTW: '繁體中文',
    enUS: 'English(英文)',
  },
};
