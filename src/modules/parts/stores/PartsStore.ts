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
    test() {
      for (let i = 0; i < 100; i += 1) {
        this.$state.push({
          id: i,
          number: '123',
          name: '13',
          isEndItem: true,
          isPhantom: true,
          viewType: ViewType.Design,
          viewSubtypeId: 0,
          createUser: '123',
          createDate: new Date(),
          updateUser: '123',
          updateDate: new Date(),
          remarks: '',
          checkout: false,
          checkoutId: 0,
          version: {
            id: 1,
            masterId: 1,
            iteration: 1,
            revision: 1,
            checkout: false,
            createUser: '123',
            createDate: new Date(),
            updateUser: '123',
            updateDate: new Date(),
            remarks: '',
          },
        });
      }
    },
  },
});

export default PartsStore;
