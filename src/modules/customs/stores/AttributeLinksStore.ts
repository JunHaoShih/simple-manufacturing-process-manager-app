import { defineStore } from 'pinia';
import { AttributeLinks } from '../models/AttributeLinks';

export interface AttributeLinksContainer {
  content: AttributeLinks,
}

export const AttributeLinksStore = defineStore('attributeLinks', {
  state: (): AttributeLinksContainer => ({
    content: {
      objectTypeId: 0,
      attributes: [],
    },
  }),
});
