<template>
  <q-dialog ref="dialogRef" v-model="prompt" persistent
    transition-show="rotate" transition-hide="rotate"
  >
    <q-card style="min-width: 700px">
      <q-card-section class="bg-primary text-white row items-center">
        <div class="text-h6">{{ $t('parts.new') }}</div>
        <q-space></q-space>
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-separator />
      <q-card-section style="max-height: 90vh" class="scroll">
        <ValidationInput v-model="createPartStore.number" :label="$t('parts.number')"
          :inputValidator="partValidationService.checkNumberRules"
        />
        <ValidationInput v-model="createPartStore.name" :label="$t('parts.name')"
          :inputValidator="partValidationService.checkNameRules"
        />
        <div class="row">
          <q-checkbox
            left-label
            v-model="createPartStore.isEndItem"
            :label="$t('parts.endItem')"
          />
          <q-checkbox
            left-label
            v-model="createPartStore.isPhantom"
            :label="$t('parts.phantom')"
            class="q-ml-md"
          />
        </div>
        <div>
          <div>{{ $t('parts.view') }}</div>
          <q-select filled v-model="viewTypeOption" :options="viewTypeOptionsStore.i18nOptions"
            :label="$t('parts.view')" @update:modelValue="onViewTypeUpdated" />
        </div>
        <div>
          <div>{{ $t('source') }}</div>
          <q-select filled v-model="sourceOption" :options="sourcesStore.options"
            :label="$t('source')" @update:modelValue="onSourceTypeUpdated" />
        </div>
        <div>
          <div>{{ $t('unit') }}</div>
          <q-select filled v-model="unitOption" :options="unitsStore.options"
            :label="$t('unit')" @update:modelValue="onUnitTypeUpdated" />
        </div>
        <div class="column">
          <div>{{ $t('remarks') }}</div>
          <q-input
            v-model="createPartStore.remarks"
            label="remarks" filled
            type="textarea"
          />
        </div>
      </q-card-section>
      <q-separator />
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
import { SourceOption } from 'src/modules/sources/models/Source';
import ValidationInput from 'src/components/ValidationInput.vue';
import SourcesStore from 'src/modules/sources/stores/SourcesStore';
import UnitsStore from 'src/modules/units/stores/UnitsStore';
import { UnitOption } from 'src/modules/units/models/Unit';
import PartValidationService from '../PartValidateService';
import CreatePartStore from '../stores/CreatePartStore';
import ViewTypeOptionsStore from '../stores/ViewTypeOptionsStore';
import { ViewTypeOption } from '../models/Part';

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

  viewTypeOptionsStore = ViewTypeOptionsStore();

  viewTypeOption = {} as ViewTypeOption;

  sourceOption = {} as SourceOption;

  unitOption = {} as UnitOption;

  @Ref
  // eslint-disable-next-line indent
  dialogRef!: QDialog;

  onViewTypeUpdated(value: ViewTypeOption) {
    this.createPartStore.viewType = value.value;
  }

  onSourceTypeUpdated(value: SourceOption) {
    this.createPartStore.sourceId = value.value;
  }

  onUnitTypeUpdated(value: UnitOption) {
    this.createPartStore.unitId = value.value;
  }

  async created() {
    const option = this.viewTypeOptionsStore.i18nOptions[0];
    this.viewTypeOption = option;
    await this.sourcesStore.init();
    // eslint-disable-next-line prefer-destructuring
    const so = this.sourcesStore.options[0];
    this.sourceOption = so;
    await this.unitsStore.init();
    const uo = this.unitsStore.options[0];
    this.unitOption = uo;
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
