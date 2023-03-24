import { defineStore } from 'pinia';
import { Md5 } from 'ts-md5';
import { AppUser } from '../models/AppUser';

const CurrentUserStore = defineStore('currentUser', {
  state: (): AppUser => ({
    id: 0,
    username: '00000000000000000000000000000000',
    fullName: '',
  }),
  getters: {
    getGravatar(state): string {
      return `https://www.gravatar.com/avatar/${Md5.hashStr(state.username)}?s=32&d=identicon`;
    },
  },
});

export default CurrentUserStore;
