import { defineStore } from 'pinia';
import { CreatePartDTO } from '../dtos/CreatePartDTO';

const CreatePartStore = defineStore('createPart', {
  state: (): CreatePartDTO => ({} as CreatePartDTO),
});

export default CreatePartStore;
