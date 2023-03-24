import { defineStore } from 'pinia';
import { Part } from '../models/Part';

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
  },
});

export default PartsStore;
