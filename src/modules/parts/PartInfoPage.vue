<template>
  <div class="q-pa-sm main-panel">
    <PartInfoPanel
      :id="id"
      :readonly="true"
      v-model="partVersionStore.content"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-facing-decorator';
import 'src/extensions/date.extensions';
import ValidationInput from 'src/components/ValidationInput.vue';
import { PartVersionStore } from './stores/PartVersionStore';
import PartInfoPanel from './components/PartInfoPanel.vue';

@Component({
  components: {
    ValidationInput,
    PartInfoPanel,
  },
})
export default class PartInfoPage extends Vue {
  @Prop id = '';

  partVersionStore = PartVersionStore();
}
</script>

<style lang="sass" scoped>
.outer-max
  height: calc(100vh - 70px)
</style>
