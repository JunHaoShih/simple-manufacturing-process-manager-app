<template>
  <q-tabs align="left" indicator-color="orange">
    <q-route-tab
      :label="$t('customs.attributes.title')"
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
