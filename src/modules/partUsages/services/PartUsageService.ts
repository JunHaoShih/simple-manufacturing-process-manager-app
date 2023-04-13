import { api } from 'src/boot/axios';
import { Notify } from 'quasar';
import { SPRMResponse } from 'src/models/SPRMResponse';
import { PartUsageUses } from '../models/PartUsageUses';

const getByParentVersionId = async (parentVersionId: number): Promise<PartUsageUses[] | null> => {
  const searchUrl = `/api/PartUsage/ByParent/${parentVersionId}`;
  const partUsages = await api.get(encodeURI(searchUrl))
    .then((response): PartUsageUses[] => {
      const data = response.data as SPRMResponse<PartUsageUses[]>;
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
  return partUsages;
};

export const PartUsageService = {
  getByParentVersionId,
};
