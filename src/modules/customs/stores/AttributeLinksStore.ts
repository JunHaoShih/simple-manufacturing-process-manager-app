import { defineStore } from 'pinia';
import { AttributeLinks } from '../models/AttributeLinks';
import { CustomAttribute } from '../models/CustomAttribute';

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
  actions: {
    deleteLinks(targetAttrs: CustomAttribute[]): void {
      this.content.attributes = this.content.attributes.filter(
        (attribute) => !targetAttrs.find((targetAttr) => targetAttr.id === attribute.id),
      );
    },
  },
});
