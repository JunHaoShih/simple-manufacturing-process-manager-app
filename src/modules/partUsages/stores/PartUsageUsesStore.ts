import { defineStore } from 'pinia';
import { QTreeNode, QTreeProps } from 'quasar';
import { PartVersion } from 'src/modules/parts/models/PartVersion';
import { PartUsageUses } from '../models/PartUsageUses';

export interface PartUsageUsesContainer {
  uses: Map<number, Map<number, PartUsageUses>>,
  root: PartVersion,
}

let idCounter = 0;

const getSubTreeNodes = (mapValue: Map<number, PartUsageUses>, wholeMap: Map<number, Map<number, PartUsageUses>>): QTreeProps['nodes'] => {
  const nodes = [] as QTreeNode[];
  mapValue.forEach((value) => {
    const currentNode: QTreeNode = {
      id: idCounter,
      label: `${value.uses.number} - ${value.uses.version.iteration}.${value.uses.version.revision}`,
      icon: 'settings',
      versionId: value.uses.version.id,
      usageId: value.id,
      lazy: true,
    };
    console.log(`Counter: ${idCounter}`);
    idCounter += 1;
    const children = wholeMap.get(value.uses.version.id);
    if (children) {
      currentNode.children = getSubTreeNodes(children, wholeMap);
      currentNode.lazy = false;
    }
    nodes.push(currentNode);
  });
  return nodes;
};

const getTreeNodes = (uses: Map<number, Map<number, PartUsageUses>>, root: PartVersion): QTreeProps['nodes'] => {
  idCounter = 0;
  if (!root.master) {
    return [{
      id: idCounter,
      label: '',
      versionId: 0,
      usageId: 0,
      icon: 'settings',
    }];
  }
  const rootNode: QTreeNode = {
    id: idCounter,
    label: `${root.master.number} - ${root.iteration}.${root.revision}`,
    versionId: root.id,
    usageId: 0,
    icon: 'settings',
  };
  idCounter += 1;
  if (root.id) {
    const children = uses.get(root.id);
    if (children) {
      rootNode.children = getSubTreeNodes(children, uses);
    }
  }
  return [rootNode];
};

export const PartUsageUsesStore = defineStore('partUsageUses', {
  state: (): PartUsageUsesContainer => ({
    uses: new Map<number, Map<number, PartUsageUses>>(),
    root: {} as PartVersion,
  }),
  getters: {
    treeNodes: (state): QTreeProps['nodes'] => {
      if (!state.root.master) {
        return [{
          label: '',
          icon: 'room_service',
        }];
      }
      console.log('Test');
      const rootNode = getTreeNodes(state.uses, state.root);
      return rootNode;
    },
  },
  actions: {
    initialize(usages: PartUsageUses[], partVersion: PartVersion) {
      this.root = partVersion;
      this.uses = new Map<number, Map<number, PartUsageUses>>();
      for (let i = 0; i < usages.length; i += 1) {
        const usage = usages[i];
        if (!this.uses.has(usage.usedBy)) {
          this.uses.set(usage.usedBy, new Map<number, PartUsageUses>());
        }
        if (!this.uses.get(usage.usedBy)?.has(usage.uses.version.id)) {
          this.uses.get(usage.usedBy)?.set(usage.uses.version.id, usage);
        }
      }
      this.root = partVersion;
    },
    addUses(usages: PartUsageUses[]) {
      for (let i = 0; i < usages.length; i += 1) {
        const usage = usages[i];
        if (!this.uses.has(usage.usedBy)) {
          this.uses.set(usage.usedBy, new Map<number, PartUsageUses>());
        }
        if (!this.uses.get(usage.usedBy)?.has(usage.uses.version.id)) {
          this.uses.get(usage.usedBy)?.set(usage.uses.version.id, usage);
        }
      }
    },
  },
});
