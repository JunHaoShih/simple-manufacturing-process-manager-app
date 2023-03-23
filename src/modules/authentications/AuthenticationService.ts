import { api } from 'src/boot/axios';
import { Notify } from 'quasar';
import { SMPMResponse } from 'src/models/SMPMResponse';
import { AuthenticationResponse } from './models/AuthenticationResponse';
import { AuthenticationDTO } from './models/AuthenticationDTO';

const login = async (username: string, password: string):
Promise<SMPMResponse<AuthenticationResponse> | null> => {
  const loginDTO: AuthenticationDTO = {
    username,
    password,
  };
  const worldTimeResponse = await api.post('/api/Authentication', loginDTO)
    .then((response): SMPMResponse<AuthenticationResponse> => {
      const data = response.data as SMPMResponse<AuthenticationResponse>;
      localStorage.setItem('token', data.content.token);
      return data;
    })
    .catch((error) => {
      let message = '';
      if (error.response) {
        const body: SMPMResponse<string> = error.response.data;
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
  return worldTimeResponse;
};

const AuthenticationService = {
  login,
};

export default AuthenticationService;
