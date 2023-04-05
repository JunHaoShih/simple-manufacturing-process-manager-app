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
      success: 'Insert success',
    },
    update: {
      success: 'Update success',
    },
    search: 'Search',
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
  customs: {
    title: 'Customization',
    caption: 'Manage your settings',
    attributes: {
      title: 'Custom attributes',
      caption: 'Customize your aiiributes',
      attribteType: 'Attribte type',
      displayType: 'Display type',
      types: {
        string: 'String',
      },
      displays: {
        singleSelect: 'Single select',
        value: 'Value',
      },
    },
    attributeLinks: {
      title: 'Attribute links',
      caption: 'Link your attributes to object types',
    },
    generic: {
      number: 'Number',
      name: 'Name',
      disable: 'Disable',
    },
  },
  iterable: {
    version: 'Version',
    iteration: 'Iteration',
    revision: 'Revision',
    checkout: 'Checkout',
  },
  validations: {
    notNull: 'Cannot be empty',
    parts: {
      shorterThan3: 'Cannot be shorter than 3',
      longerThan50: 'Cannot be longer than 50',
      invalidChar: 'Only number, alphabets, dash and underscore are valid',
    },
    customAttributes: {
      options: {
        longerThan20: 'Cannot be longer than 20',
        keyInvalidChar: 'Only number, uppercase alphabets, dash and underscore are valid',
        valueInvalidChar: 'Cannot cantain any invalid characters',
      },
    },
  },
  source: 'Source',
  unit: 'Unit',
  remarks: 'Remarks',
  language: 'Language',
  key: 'Key',
  value: 'Value',
  info: 'Info',
  lang: {
    zhTW: '繁體中文(Traditional Chinese)',
    enUS: 'English',
  },
};
