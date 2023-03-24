import { api } from 'src/boot/axios';
import { Notify } from 'quasar';
import { SPRMResponse } from 'src/models/SPRMResponse';
import { PartResponse } from './models/PartResponse';

const getByPattern = async (pattern: string):
Promise<PartResponse[] | null> => {
  const partsResponse = await api.get(`/api/Part/Search${pattern ? `?pattern=${pattern}` : ''}`)
    .then((response): PartResponse[] => {
      const data = response.data as SPRMResponse<PartResponse[]>;
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
  return partsResponse;
};

const PartService = {
  getByPattern,
};

export default PartService;
