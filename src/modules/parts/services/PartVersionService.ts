import { api } from 'src/boot/axios';
import { Notify } from 'quasar';
import { SPRMResponse } from 'src/models/SPRMResponse';
import { PartVersion } from '../models/PartVersion';

const getById = async (id: number): Promise<PartVersion | null> => {
  const searchUrl = `/api/PartVersion/${id}`;
  const partVersionResponse = await api.get(encodeURI(searchUrl))
    .then((response): PartVersion => {
      const data = response.data as SPRMResponse<PartVersion>;
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
  return partVersionResponse;
};

export const PartVersionService = {
  getById,
};
