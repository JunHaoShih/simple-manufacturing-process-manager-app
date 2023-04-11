<template>
  <div class="q-pa-sm main-panel">
    <q-card style="min-width: 700px">
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
            <ValidationInput v-model="partVersionStore.content.master.number"
              :inputValidator="partValidationService.checkNumberRules"
              :readonly="true"
            />
            <div class="q-ma-sm">{{ $t('parts.name') }}</div>
            <ValidationInput v-model="partVersionStore.content.master.name"
              :inputValidator="partValidationService.checkNameRules"
              :readonly="true"
            />
            <div class="row">
              <q-checkbox
                left-label
                v-model="partVersionStore.content.master.isEndItem"
                :label="$t('parts.endItem')"
                :disable="readonly"
              />
              <q-checkbox
                left-label
                v-model="partVersionStore.content.master.isPhantom"
                :label="$t('parts.phantom')"
                class="q-ml-md"
                :disable="readonly"
              />
            </div>
            <div>
              <div class="q-ma-sm">{{ $t('parts.view') }}</div>
              <q-select
                filled
                dense
                v-model="viewTypeOption"
                :options="viewTypeOptionsStore.i18nOptions"
                :readonly="readonly"
              />
            </div>
            <div>
              <div class="q-ma-sm">{{ $t('source') }}</div>
              <q-select
                filled
                dense
                v-model="sourceOption"
                :options="sourcesStore.options"
                :readonly="readonly"
              />
            </div>
            <div>
              <div class="q-ma-sm">{{ $t('unit') }}</div>
              <q-select
                filled
                dense
                v-model="unitOption"
                :options="unitsStore.options"
                :readonly="readonly"
              />
            </div>
            <div class="column">
              <div class="q-ma-sm">{{ $t('remarks') }}</div>
              <q-input
                v-model="partVersionStore.content.remarks"
                label="remarks" filled
                type="textarea"
                :readonly="readonly"
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
                  :readonly="readonly"
                  v-model="middleCustomOptions[attribute.id]"
                  :options="getSelectOption(attribute.options, attribute.number)"
                  @update:modelValue="onSelectOptionUpdated" />
                <ValidationInput
                  v-else
                  v-model="partVersionStore.content.customValues[attribute.number]"
                  :readonly="readonly"
                />
              </div>
            </div>
          </q-expansion-item>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-facing-decorator';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import 'src/extensions/date.extensions';
import ValidationInput from 'src/components/ValidationInput.vue';
import { SelectOption } from 'src/models/SelectOption';
import { AttributeLinksStore } from '../customs/stores/AttributeLinksStore';
import ViewTypeOptionsStore from './stores/ViewTypeOptionsStore';
import { ViewTypeOption } from './models/Part';
import { SourcesStore } from '../sources/stores/SourcesStore';
import { UnitsStore } from '../units/stores/UnitsStore';
import { SourceOption } from '../sources/models/Source';
import { UnitOption } from '../units/models/Unit';
import { CustomOption, DisplayType } from '../customs/models/CustomAttribute';
import { PartVersionStore } from './stores/PartVersionStore';
import PartValidationService from './services/PartValidateService';

@Component({
  components: {
    ValidationInput,
  },
})
export default class PartInfoPage extends Vue {
  @Prop id = '';

  i18n = useI18n();

  $q = useQuasar();

  attrLinksStore = AttributeLinksStore();

  viewTypeOptionsStore = ViewTypeOptionsStore();

  sourcesStore = SourcesStore();

  unitsStore = UnitsStore();

  partVersionStore = PartVersionStore();

  partValidationService = PartValidationService;

  infoExpanded = true;

  customValuesExpanded = true;

  readonly = true;

  viewTypeOption = {} as ViewTypeOption;

  sourceOption = {} as SourceOption;

  unitOption = {} as UnitOption;

  readonly SingleSelect = DisplayType.SingleSelect;

  middleCustomOptions: Record<number, string> = {};

  async created() {
    const option = this.viewTypeOptionsStore.i18nOptions[0];
    this.viewTypeOption = option;
    await this.sourcesStore.init();
    const so = this.sourcesStore.options[0];
    this.sourceOption = so;
    await this.unitsStore.init();
    const uo = this.unitsStore.options[0];
    this.unitOption = uo;
    for (let i = 0; i < this.attrLinksStore.content.attributes.length; i += 1) {
      const attr = this.attrLinksStore.content.attributes[i];
      if (attr.displayType === DisplayType.SingleSelect) {
        const firstOption = attr.options[0];
        this.middleCustomOptions[attr.id] = firstOption.key;
      }
    }
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
    this.partVersionStore.content.customValues[selectOption.attributeNumber] = selectOption.value;
    console.log(this.partVersionStore.content.customValues);
  }
}
</script>

<style lang="sass" scoped>
.outer-max
  height: calc(100vh - 70px)
</style>
