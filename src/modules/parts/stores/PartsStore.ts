import { defineStore } from 'pinia';
import { PartResponse } from '../models/PartResponse';

const PartsStore = defineStore('parts', {
  state: (): PartResponse[] => [] as PartResponse[],
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
