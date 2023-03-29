<template>
  <q-tabs align="left" indicator-color="secondary">
    <q-route-tab
      label="Custom attributes"
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
