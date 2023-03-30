import { api } from 'src/boot/axios';
import { Notify } from 'quasar';
import { SPRMResponse } from 'src/models/SPRMResponse';
import { CreateCustomAttributeDTO } from '../models/CreateCustomAttributeDTO';
import { CustomAttribute } from '../models/CustomAttribute';

const create = async (createDto: CreateCustomAttributeDTO)
: Promise<CustomAttribute | null> => {
  const newAttribute = await api.post('api/CustomAttribute', createDto)
    .then((response): CustomAttribute => {
      const data = response.data as SPRMResponse<CustomAttribute>;
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
  return newAttribute;
};

const getAll = async () : Promise<CustomAttribute[] | null> => {
  const attributes = await api.get('api/CustomAttribute')
    .then((response): CustomAttribute[] => {
      const data = response.data as SPRMResponse<CustomAttribute[]>;
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
  return attributes;
};

const CustomAttributeService = {
  create,
  getAll,
};

export default CustomAttributeService;
