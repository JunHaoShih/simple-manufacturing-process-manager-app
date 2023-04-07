import { api } from 'src/boot/axios';
import { Notify } from 'quasar';
import { SPRMResponse } from 'src/models/SPRMResponse';
import { AttributeLinks } from '../models/AttributeLinks';

/**
 * Get attribute links by object type id
 * @param objectTypeId object type id
 * @returns AttributeLinks (null if error occured)
 */
const getByObjectTypeId = async (objectTypeId: number): Promise<AttributeLinks | null> => {
  const attributeLinks = await api.get(`api/AttributeLink/ByObjectType?objectTypeId=${objectTypeId}`)
    .then((response): AttributeLinks => {
      const data = response.data as SPRMResponse<AttributeLinks>;
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
  return attributeLinks;
};

export const AttributeLinkService = {
  getByObjectTypeId,
};
