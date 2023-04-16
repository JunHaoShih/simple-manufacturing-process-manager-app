<template>
  <div class="q-pa-sm main-panel">
    <PartInfoPanel
      :id="id"
      :readonly="false"
      v-model="partVersionStore.content"
    />
    <q-footer elevated>
      <q-toolbar>
        <q-space />
        <q-btn
          color="deep-orange"
          glossy
          label="Save"
          @click="onSaveClicked"
        />
      </q-toolbar>
    </q-footer>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-facing-decorator';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import 'src/extensions/date.extensions';
import ValidationInput from 'src/components/ValidationInput.vue';
import { PartVersionStore } from './stores/PartVersionStore';
import PartInfoPanel from './components/PartInfoPanel.vue';
import { AttributeLinksStore } from '../customs/stores/AttributeLinksStore';
import { PartVersionService } from './services/PartVersionService';

@Component({
  components: {
    ValidationInput,
    PartInfoPanel,
  },
})
export default class PartInfoEditPage extends Vue {
  @Prop id = '';

  i18n = useI18n();

  $q = useQuasar();

  partVersionStore = PartVersionStore();

  attrLinksStore = AttributeLinksStore();

  partVersionService = PartVersionService;

  async created() {
    this.partVersionStore.content.customValues = Object.fromEntries(this.attrLinksStore.content.attributes.map((attr) => [attr.number, '']));
    const targetVersion = await this.partVersionService.getById(Number(this.id));
    if (targetVersion) {
      this.partVersionStore.content = targetVersion;
    }
  }

  async onSaveClicked(): Promise<void> {
    const code = await this.partVersionService.update(this.partVersionStore.content.id, {
      customValues: this.partVersionStore.content.customValues,
      remarks: this.partVersionStore.content.remarks,
    });
    if (code === 0) {
      this.$q.notify({
        message: this.i18n.t('actions.updates.success'),
        color: 'secondary',
      });
    }
  }
}
</script>

<style lang="sass" scoped>
.outer-max
  height: calc(100vh - 70px)
</style>
