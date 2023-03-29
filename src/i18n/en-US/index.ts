export default {
  title: 'Simple Production Routing Management',
  menu: 'Menu',
  logout: 'Logout',
  actions: {
    action: 'Action',
    add: 'Add',
    edit: 'Edit',
    delete: 'Delete',
    cancel: 'Cancel',
    confirm: 'Confirm',
    inserts: {
      success: 'Insert Success',
    },
  },
  base: {
    creator: 'Creater',
    modifier: 'Modifier',
    createDate: 'Create date',
    modifiedDate: 'Modifiy date',
  },
  parts: {
    title: 'Parts management',
    caption: 'Manage your parts',
    part: 'Part',
    routing: 'Routing',
    number: 'Number',
    name: 'Name',
    endItem: 'End item',
    phantom: 'Phantom',
    view: 'View',
    views: {
      design: 'Design',
      manufacturing: 'Manufacturing',
    },
    new: 'New part',
  },
  iterable: {
    version: 'Version',
    iteration: 'Iteration',
    revision: 'Revision',
    checkout: 'Checkout',
  },
  validations: {
    parts: {
      notNull: 'Cannot be empty',
      shorterThan3: 'Cannot be shorter than 3',
      longerThan50: 'Cannot be longer than 50',
      invalidChar: 'Only number, alphabets, dash and underscore are valid',
    },
  },
  source: 'Source',
  unit: 'Unit',
  remarks: 'Remarks',
  lang: {
    zhTW: '繁體中文(Traditional Chinese)',
    enUS: 'English',
  },
};
