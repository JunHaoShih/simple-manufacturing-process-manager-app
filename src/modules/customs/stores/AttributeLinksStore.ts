import { defineStore } from 'pinia';
import { ObjectTypeId } from 'src/modules/objectTypes/models/ObjectType';
import { AttributeLinkService } from '../services/AttributeLinkService';
import { AttributeLinks } from '../models/AttributeLinks';
import { CustomAttribute } from '../models/CustomAttribute';

export interface AttributeLinksContainer {
  content: AttributeLinks,
}

export const AttributeLinksStore = defineStore('attributeLinks', {
  state: (): AttributeLinksContainer => ({
    content: {
      objectTypeId: ObjectTypeId.None,
      attributes: [],
    },
  }),
  actions: {
    async initialize(objectTypeId: ObjectTypeId): Promise<void> {
      const attrLinks = await AttributeLinkService.getByObjectTypeId(objectTypeId);
      if (attrLinks) {
        this.content = attrLinks;
      }
    },
    deleteLinks(targetAttrs: CustomAttribute[]): void {
      this.content.attributes = this.content.attributes.filter(
        (attribute) => !targetAttrs.find((targetAttr) => targetAttr.id === attribute.id),
      );
    },
  },
});
