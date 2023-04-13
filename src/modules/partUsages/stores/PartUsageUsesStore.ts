import { defineStore } from 'pinia';
import { QTreeProps } from 'quasar';
import { PartVersion } from 'src/modules/parts/models/PartVersion';
import { PartUsageUses } from '../models/PartUsageUses';

export interface PartUsageUsesContainer {
  uses: Record<number, Record<number, PartUsageUses>>,
  root: PartVersion,
}

export const PartUsageUsesStore = defineStore('partUsageUses', {
  state: (): PartUsageUsesContainer => ({
    uses: {} as Record<number, Record<number, PartUsageUses>>,
    root: {} as PartVersion,
  }),
  getters: {
    treeNodes: (state): QTreeProps['nodes'] => [
      {
        id: 0,
        label: 'Satisfied customers (with avatar)',
        avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
        children: [
          {
            label: 'Good food (with icon)',
            icon: 'restaurant_menu',
            children: [
              { label: 'Quality ingredients' },
              { label: 'Good recipe' },
            ],
          },
          {
            label: 'Good service (disabled node with icon)',
            icon: 'room_service',
            disabled: true,
            children: [
              { label: 'Prompt attention' },
              { label: 'Professional waiter' },
            ],
          },
          {
            label: 'Pleasant surroundings (with icon)',
            icon: 'photo',
            children: [
              {
                label: 'Happy atmosphere (with image)',
                img: 'https://cdn.quasar.dev/img/logo_calendar_128px.png',
              },
              { label: 'Good table presentation' },
              { label: 'Pleasing decor' },
            ],
          },
        ],
      },
    ],
  },
  actions: {
    initialize(usages: PartUsageUses[], partVersion: PartVersion) {
      this.root = partVersion;
      for (let i = 0; i < usages.length; i += 1) {
        const usage = usages[i];
        if (!this.uses[usage.usedBy]) {
          this.uses[usage.usedBy] = {} as Record<number, PartUsageUses>;
        }
        if (!this.uses[usage.usedBy][usage.uses.version.id]) {
          this.uses[usage.usedBy][usage.uses.version.id] = usage;
        }
      }
    },
  },
});
