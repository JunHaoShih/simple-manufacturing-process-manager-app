<template>
  <q-dialog ref="dialogRef" v-model="prompt" persistent>
    <q-card style="min-width: 700px">
      <q-card-section>
        <div class="text-h6">{{ $t('parts.new') }}</div>
      </q-card-section>
      <!-- number input -->
      <q-card-section class="q-pt-none">
        <ValidationInput v-model="createPartStore.number" :label="$t('parts.number')"
          :inputValidator="partValidationService.checkNumberRules"></ValidationInput>
      </q-card-section>
      <q-card-actions align="right" class="text-primary">
        <q-btn flat :label="$t('actions.cancel')" v-close-popup></q-btn>
        <q-btn flat :label="$t('actions.confirm')" @click="onDialogConfirm"></q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import {
  Component, Model, Ref, Vue,
} from 'vue-facing-decorator';
import { QDialog } from 'quasar';
import { useI18n } from 'vue-i18n';
import ValidationInput from 'src/components/ValidationInput.vue';
import SourcesStore from 'src/modules/sources/stores/SourcesStore';
import UnitsStore from 'src/modules/units/stores/UnitsStore';
import PartValidationService from '../PartValidateService';
import CreatePartStore from '../stores/CreatePartStore';

@Component({
  components: {
    ValidationInput,
  },
})
export default class PartDialog extends Vue {
  i18n = useI18n();

  sourcesStore = SourcesStore();

  unitsStore = UnitsStore();

  createPartStore = CreatePartStore();

  @Model
  // eslint-disable-next-line indent
  prompt!: boolean;

  errorMessage = '';

  partValidationService = PartValidationService;

  @Ref
  // eslint-disable-next-line indent
  dialogRef!: QDialog;

  async created() {
    this.sourcesStore.init();
    this.unitsStore.init();
  }

  onDialogConfirm(): void {
    this.dialogRef.hide();
  }

  isValueError(value: string): boolean {
    const result = this.partValidationService.checkNumberRules(value);
    if (result) {
      this.errorMessage = result;
      return true;
    }
    return false;
  }
}
</script>
