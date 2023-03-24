import { api } from 'src/boot/axios';
import { Notify } from 'quasar';
import { SPRMResponse } from 'src/models/SPRMResponse';
import { AppUser } from './models/AppUser';

const getCurrentUser = async (): Promise<AppUser | null> => {
  const appUser = await api.get('/api/AppUser/Me')
    .then((response) => {
      const data = response.data as SPRMResponse<AppUser>;
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
  return appUser;
};

const AppUserService = {
  getCurrentUser,
};

export default AppUserService;
