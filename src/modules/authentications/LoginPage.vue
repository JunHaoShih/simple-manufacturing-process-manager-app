<template>
  <div class="">
    <q-layout view="lHh lpr lFf">
      <q-header elevated>
        <q-toolbar>
          <q-toolbar-title>
            Simple Manufacturing Process Manager
          </q-toolbar-title>
        </q-toolbar>
      </q-header>
      <q-page-container>
        <q-page padding class="row justify-center items-center">
          <div class="column">
            <div class="row">
              <h5 class="text-h5 q-my-md">Login</h5>
            </div>
            <div class="row">
              <q-card square bordered class="q-pa-lg shadow-1">
                <q-card-section>
                  <q-form class="q-gutter-md">
                    <q-input ref="inputRef" square filled clearable v-model="username"
                    label="username"
                    style="width: 300px;" />
                    <q-input square filled clearable v-model="password" type="password"
                    label="password" style="width: 300px;" />
                  </q-form>
                </q-card-section>
                <q-card-actions class="q-px-md">
                  <q-btn unelevated color="light-green-7" size="lg" class="full-width"
                  label="Login" @click="onSubmit" />
                </q-card-actions>
              </q-card>
            </div>
          </div>
        </q-page>
      </q-page-container>
    </q-layout>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-facing-decorator';
import WorldTimeService from '../world-time/WorldTimeService';
import AuthenticationService from './AuthenticationService';

@Component({})
export default class LoginPage extends Vue {
  username = '';

  password = '';

  worldTimeService = WorldTimeService;

  authenticationService = AuthenticationService;

  async onSubmit(): Promise<void> {
    const response = await this.authenticationService.login(this.username, this.password);
    if (response) {
      this.$router.push('/');
    }
  }

  onReset(): void {
    this.username = '';
    this.password = '';
  }
}
</script>
