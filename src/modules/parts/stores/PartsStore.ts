import { defineStore } from 'pinia';
import { Part, PartVersion, ViewType } from '../models/Part';

const PartsStore = defineStore('parts', {
  state: (): Part[] => [] as Part[],
  getters: {
    getCreateDateStr: (state) => (date :Date): string => {
      const dateStr = new Date(date).toISOString().split('T')[0];
      return dateStr;
    },
    getCreateDateFullStr: (state) => (date :Date): string => {
      const dateStr = new Date(date).toString();
      return dateStr;
    },
    getVersion: (state) => (partVersion: PartVersion): string => {
      const versionStr = `${partVersion.iteration}.${partVersion.revision}`;
      return versionStr;
    },
    isInitialized: (state) => (part: Part): boolean => {
      if (!part.checkoutId) {
        return false;
      }
      return part.checkoutId !== part.version.id;
    },
  },
  actions: {
    addPart(part: Part): void {
      this.$state.push(part);
    },
  },
});

export default PartsStore;
