import { defineStore } from 'pinia';
import { QTreeNode, QTreeProps } from 'quasar';
import { PartVersion } from 'src/modules/parts/models/PartVersion';
import { PartUsageUses } from '../models/PartUsageUses';

export interface PartUsageUsesTreeContainer {
  rootNodes: QTreeNode[],
}

export const PartUsageUsesTreeStore = defineStore('partUsageUsesTree', {
  state: (): PartUsageUsesTreeContainer => ({
    rootNodes: [],
  }),
  actions: {
    getTreeNodes(uses: Map<number, Map<number, PartUsageUses>>, root: PartVersion): QTreeProps['nodes'] {
      if (!root.master) {
        return [{
          label: '',
          icon: 'room_service',
        }];
      }
      const rootNode: QTreeNode = {
        label: root.master.number,
        icon: 'room_service',
      };
      if (root.id) {
        const children = uses.get(root.id);
        if (children) {
          rootNode.children = this.getSubTreeNodes(children, uses);
        }
      }
      return [rootNode];
    },
    getSubTreeNodes(mapValue: Map<number, PartUsageUses>, wholeMap: Map<number, Map<number, PartUsageUses>>): QTreeProps['nodes'] {
      const nodes = [] as QTreeNode[];
      mapValue.forEach((value) => {
        const currentNode: QTreeNode = {
          label: value.uses.number,
          icon: 'room_service',
        };
        const children = wholeMap.get(value.uses.version.id);
        if (children) {
          currentNode.children = this.getSubTreeNodes(children, wholeMap);
        }
        nodes.push(currentNode);
      });
      this.rootNodes = nodes;
      return nodes;
    },
  },
});
