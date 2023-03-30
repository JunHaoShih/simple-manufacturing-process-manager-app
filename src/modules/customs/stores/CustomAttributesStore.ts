import { defineStore } from 'pinia';
import { CustomAttribute } from '../models/CustomAttribute';

export interface CustomAttributesContainer {
  attributes: CustomAttribute[],
}

const CustomAttributesStore = defineStore('customAttributes', {
  state: (): CustomAttributesContainer => ({
    attributes: [],
  }),
  actions: {
    setAttributes(attrs: CustomAttribute[]): void {
      this.attributes = attrs;
    },
  },
});

export default CustomAttributesStore;
