import { defineStore } from 'pinia';
import { QTreeProps } from 'quasar';
import { PartVersion } from 'src/modules/parts/models/PartVersion';
import { PartUsageUses } from '../models/PartUsageUses';
import { PartUsageUsesTreeStore } from './PartUsageUsesTreeStore';

export interface PartUsageUsesContainer {
  uses: Map<number, Map<number, PartUsageUses>>,
  root: PartVersion,
}

export const PartUsageUsesStore = defineStore('partUsageUses', {
  state: (): PartUsageUsesContainer => ({
    uses: new Map<number, Map<number, PartUsageUses>>(),
    root: {} as PartVersion,
  }),
  getters: {
    treeNodes: (state): QTreeProps['nodes'] => {
      const partUsageUsesTreeStore = PartUsageUsesTreeStore();
      if (!state.root.master) {
        return [{
          label: '',
          icon: 'room_service',
        }];
      }
      const rootNode = partUsageUsesTreeStore.getTreeNodes(state.uses, state.root);
      return [rootNode];
    },
  },
  actions: {
    initialize(usages: PartUsageUses[], partVersion: PartVersion) {
      this.root = partVersion;
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
  },
});
