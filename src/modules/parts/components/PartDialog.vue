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
      <q-card-section class="scroll dialog-inner-max">
        <div>
          <q-expansion-item
            v-model="infoExpanded"
            icon="article"
            :label="$t('info')"
            header-class="text-h6 bg-primary text-white"
            expand-icon-class="text-white"
            class="expandable shadow-1 overflow-hidden"
            style="border-radius: 10px"
          >
          <div class="q-pa-sm">
            <div class="q-ma-sm">{{ $t('parts.number') }}</div>
            <ValidationInput v-model="createPartStore.number"
              :inputValidator="partValidationService.checkNumberRules"
            />
            <div class="q-ma-sm">{{ $t('parts.name') }}</div>
            <ValidationInput v-model="createPartStore.name"
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
              <div class="q-ma-sm">{{ $t('parts.view') }}</div>
              <q-select
                filled
                dense
                v-model="viewTypeOption"
                :options="viewTypeOptionsStore.i18nOptions"
                @update:modelValue="onViewTypeUpdated" />
            </div>
            <div>
              <div class="q-ma-sm">{{ $t('source') }}</div>
              <q-select
                filled
                dense
                v-model="sourceOption"
                :options="sourcesStore.options"
                @update:modelValue="onSourceTypeUpdated" />
            </div>
            <div>
              <div class="q-ma-sm">{{ $t('unit') }}</div>
              <q-select
                filled
                dense
                v-model="unitOption"
                :options="unitsStore.options"
                @update:modelValue="onUnitTypeUpdated" />
            </div>
            <div class="column">
              <div class="q-ma-sm">{{ $t('remarks') }}</div>
              <q-input
                v-model="createPartStore.remarks"
                label="remarks" filled
                type="textarea"
              />
            </div>
          </div>
          </q-expansion-item>

          <q-separator class="q-mb-md"/>

          <q-expansion-item
            v-model="customValuesExpanded"
            icon="language"
            :label="$t('customs.attributes.title')"
            header-class="text-h6 bg-primary text-white"
            expand-icon-class="text-white"
            class="expandable shadow-1 overflow-hidden"
            style="border-radius: 10px"
          >
            <div class="q-pa-sm">
              <div
                v-for="attribute in attrLinksStore.content.attributes"
                :key="attribute.id"
              >
                <div class="q-ma-sm">
                  {{ attribute.languages[i18n.locale.toString()] }}
                </div>
                <q-select
                  v-if="attribute.displayType === SingleSelect"
                  filled
                  dense
                  v-model="middleCustomOptions[attribute.id]"
                  :options="getSelectOption(attribute.options, attribute.number)"
                  @update:modelValue="onSelectOptionUpdated" />
                <ValidationInput
                  v-else
                  v-model="createPartStore.customValues[attribute.number]"
                />
              </div>
            </div>
          </q-expansion-item>
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
  Component, Emit, Model, Ref, Vue,
} from 'vue-facing-decorator';
import { QDialog, useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { SelectOption } from 'src/models/SelectOption';
import { AttributeLinksStore } from 'src/modules/customs/stores/AttributeLinksStore';
import { SourceOption } from 'src/modules/sources/models/Source';
import ValidationInput from 'src/components/ValidationInput.vue';
import { SourcesStore } from 'src/modules/sources/stores/SourcesStore';
import { UnitsStore } from 'src/modules/units/stores/UnitsStore';
import { UnitOption } from 'src/modules/units/models/Unit';
import { CustomOption, DisplayType } from 'src/modules/customs/models/CustomAttribute';
import PartValidationService from '../PartValidateService';
import CreatePartStore from '../stores/CreatePartStore';
import ViewTypeOptionsStore from '../stores/ViewTypeOptionsStore';
import { Part, ViewTypeOption } from '../models/Part';

export type CustomSelectOption = SelectOption<CustomOption>;

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

  attrLinksStore = AttributeLinksStore();

  $q = useQuasar();

  @Model
  // eslint-disable-next-line indent
  prompt!: boolean;

  errorMessage = '';

  partValidationService = PartValidationService;

  viewTypeOptionsStore = ViewTypeOptionsStore();

  viewTypeOption = {} as ViewTypeOption;

  sourceOption = {} as SourceOption;

  unitOption = {} as UnitOption;

  createdPart = {} as Part;

  infoExpanded = true;

  customValuesExpanded = true;

  middleCustomOptions: Record<number, string> = {};

  readonly SingleSelect = DisplayType.SingleSelect;

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
    this.createPartStore.customValues = Object.fromEntries(this.attrLinksStore.content.attributes.map((attr) => [attr.number, '']));
    for (let i = 0; i < this.attrLinksStore.content.attributes.length; i += 1) {
      const attr = this.attrLinksStore.content.attributes[i];
      if (attr.displayType === DisplayType.SingleSelect) {
        const firstOption = attr.options[0];
        this.middleCustomOptions[attr.id] = firstOption.key;
      }
    }
  }

  async onDialogConfirm(): Promise<void> {
    if (!this.createPartStore.isPartValid()) {
      return;
    }
    const newPart = await this.createPartStore.create();
    if (!newPart) {
      return;
    }
    this.createdPart = newPart;
    this.emitCreateResult();
    this.$q.notify({
      message: `${this.createdPart.number} ${this.i18n.t('actions.inserts.success')}`,
      color: 'secondary',
    });
    this.dialogRef.hide();
  }

  @Emit('onPartCreated')
  emitCreateResult(): Part {
    return this.createdPart;
  }

  getSelectOption(customOptions: CustomOption[], attributeNumber: string) {
    return customOptions.map((option): SelectOption<string> => ({
      label: option.languages[this.i18n.locale.toString()],
      value: option.key,
      attributeNumber,
    }));
  }

  onSelectOptionUpdated(selectOption: SelectOption<string>) {
    console.log(selectOption.value);
    this.createPartStore.customValues[selectOption.attributeNumber] = selectOption.value;
    console.log(this.createPartStore.customValues);
  }
}
</script>

<style lang="sass" scoped>
.dialog-inner-max
  height: calc(90vh - 120px)
</style>
