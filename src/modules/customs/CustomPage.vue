<template>
  <q-tabs>
    <q-route-tab
      icon="mail"
      to="/customizations/attributes"
      exact
    />
  </q-tabs>
  <router-view />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-facing-decorator';

@Component({})
export default class CustomPage extends Vue {
}
</script>
