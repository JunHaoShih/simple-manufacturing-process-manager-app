import { defineStore } from 'pinia';
import { Notify } from 'quasar';
import { api } from 'src/boot/axios';
import { SPRMResponse } from 'src/models/SPRMResponse';
import { Unit } from '../models/Unit';

const UnitsStore = defineStore('units', {
  state: (): Unit[] => [] as Unit[],
  getters: {
    getById: (state) => (id: number)
    : Unit | undefined => state.find((source) => source.id === id),
  },
  actions: {
    async init(): Promise<Unit[] | null> {
      const unitsResponse = await api.get('api/Unit')
        .then((response): Unit[] => {
          const data = response.data as SPRMResponse<Unit[]>;
          this.$state = data.content;
          return data.content;
        })
        .catch((error) => {
          let message = '';
          if (error.response) {
            const body: SPRMResponse<string> = error.response.data;
            message = `Error: ${body.code}, ${body.message}`;
          } else if (error.request) {
            // The request was made but no response was received
            message = 'Error: No response';
          } else {
            // Something happened in setting up the request that triggered an Error
            message = 'Something went wrong';
          }
          Notify.create({
            message,
            color: 'red',
          });
          return null;
        });
      return unitsResponse;
    },
  },
});

export default UnitsStore;
