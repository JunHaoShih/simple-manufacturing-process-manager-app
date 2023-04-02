import { defineStore } from 'pinia';
import { CustomAttribute } from '../models/CustomAttribute';

export interface CustomAttributesContainer {
  attributes: CustomAttribute[],
}

const CustomAttributesStore = defineStore('customAttributes', {
  state: (): CustomAttributesContainer => ({
    attributes: [],
  }),
  getters: {
    filteredAttributes: (state) => (pattern: string): CustomAttribute[] => state.attributes.filter(
      (attribute) => attribute.number.match(pattern) || attribute.name.match(pattern),
    ),
  },
  actions: {
    setAttributes(attrs: CustomAttribute[]): void {
      this.attributes = attrs;
    },
  },
});

export default CustomAttributesStore;
