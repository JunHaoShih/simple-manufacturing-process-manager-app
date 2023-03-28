import { defineStore } from 'pinia';
import { CreatePartDTO } from '../dtos/CreatePartDTO';
import { ViewType } from '../models/Part';

const CreatePartStore = defineStore('createPart', {
  state: (): CreatePartDTO => ({
    number: '',
    name: '',
    isEndItem: false,
    isPhantom: false,
    viewType: ViewType.Design,
    viewSubtypeId: 0,
    sourceId: 1,
    unitId: 1,
    remarks: '',
  }),
});

export default CreatePartStore;
