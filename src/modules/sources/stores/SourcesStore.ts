import { defineStore } from 'pinia';
import { Notify } from 'quasar';
import { api } from 'src/boot/axios';
import { SPRMResponse } from 'src/models/SPRMResponse';
import { Source, SourceOption } from '../models/Source';

export interface SourcesContainer {
  sources: Source[],
}

const SourcesStore = defineStore('sources', {
  state: (): SourcesContainer => ({
    sources: [],
  }),
  getters: {
    getById: (state) => (id: number)
    : Source | undefined => state.sources.find((source) => source.id === id),
    options(state): SourceOption[] {
      const arr = state.sources.map((source): SourceOption => ({
        label: source.name,
        value: source.id,
      }));
      return arr;
    },
  },
  actions: {
    async init(): Promise<Source[] | null> {
      const sourcesResponse = await api.get('api/Source')
        .then((response): Source[] => {
          const data = response.data as SPRMResponse<Source[]>;
          this.sources = data.content;
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
