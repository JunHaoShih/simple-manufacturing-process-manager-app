import { defineStore } from 'pinia';
import { Notify } from 'quasar';
import { api } from 'src/boot/axios';
import { SPRMResponse } from 'src/models/SPRMResponse';
import { Source } from '../models/Source';

const SourcesStore = defineStore('sources', {
  state: (): Source[] => [] as Source[],
  getters: {
    getById: (state) => (id: number)
    : Source | undefined => state.find((source) => source.id === id),
  },
  actions: {
    async init(): Promise<Source[] | null> {
      const sourcesResponse = await api.get('api/Source')
        .then((response): Source[] => {
          const data = response.data as SPRMResponse<Source[]>;
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
      return sourcesResponse;
    },
  },
});

export default SourcesStore;
