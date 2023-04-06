<template>
  <div>
    <!-- info area -->
    <q-expansion-item
      v-model="infoExpanded"
      icon="article"
      :label="$t('info')"
      header-class="text-h6 bg-primary text-white"
      class="expandable shadow-1 overflow-hidden"
      style="border-radius: 10px"
    >
      <div class="q-pa-sm">
        <!-- number -->
        <div class="q-ma-sm">{{ $t('customs.generic.number') }}</div>
        <ValidationInput
          v-model="inputAttr.number"
          :readonly="readonly"
          :inputValidator="customAttributeValidationService.checkAttributeNumberRules"
        />
        <!-- name -->
        <div class="q-ma-sm">{{ $t('customs.generic.name') }}</div>
        <ValidationInput
          v-model="inputAttr.name"
          :readonly="readonly"
          :inputValidator="customAttributeValidationService.checkAttributeNameRules"
        />
        <!-- disable -->
        <div class="row">
          <q-checkbox
            left-label
            class="q-ma-sm"
            v-model="inputAttr.isDisabled"
            :disable="readonly"
            :label="$t('customs.generic.disable')"
          />
        </div>
        <!-- attribute type -->
        <div class="q-ma-sm">{{ $t('customs.attributes.attribteType') }}</div>
        <q-select
          filled
          dense
          v-model="attrTypeOption"
          :options="attrTypesStore.i18nOptions"
          :readonly="readonly"
          @update:modelValue="onAttrTypeUpdated" />
        <!-- display type -->
        <div class="q-ma-sm">{{ $t('customs.attributes.displayType') }}</div>
        <q-select
          filled
          dense
          v-model="displayTypeOption"
          :options="displayTypesStore.i18nOptions"
          :readonly="readonly"
          @update:modelValue="onDisplayTypeUpdated" />
        <CustomOptionsPanel
          v-if="inputAttr.displayType === 1"
          v-model="inputAttr.options"
          :readonly="readonly"
        />
        <!-- remarks -->
        <div class="q-ma-sm">{{ $t('remarks') }}</div>
        <q-input
          v-model="inputAttr.remarks"
          :readonly="readonly"
          filled
          type="textarea"
        />
      </div>
    </q-expansion-item>

    <q-separator class="q-mb-md"/>

    <!-- language area -->
    <q-expansion-item
      v-model="langExpanded"
      icon="language"
      :label="$t('language')"
      header-class="text-h6 bg-primary text-white"
      class="expandable shadow-1 overflow-hidden"
      style="border-radius: 10px"
    >
      <div class="q-pa-sm">
        <div
          v-for="locale in availableLocales"
          :key="locale"
        >
          <div class="q-ma-sm">{{ locale }}</div>
          <ValidationInput v-model="inputAttr.languages[locale]"
            :readonly="readonly"
            :inputValidator="langValidateService.checkLanguageRules"
          />
        </div>
      </div>
    </q-expansion-item>
  </div>
</template>

<script lang="ts">
import {
  Component, Model, Prop, Vue, Watch,
} from 'vue-facing-decorator';
import { useI18n } from 'vue-i18n';
import 'src/extensions/date.extensions';
import { AvailableLocales } from 'src/models/Locale';
import ValidationInput from 'src/components/ValidationInput.vue';
import {
  AttributeTypeOption, CustomAttribute, DisplayTypeOption,
} from '../models/CustomAttribute';
import AttributeTypesStore from '../stores/AttributeTypesStore';
import DisplayTypesStore from '../stores/DisplayTypesStore';
import CustomOptionsPanel from './CustomOptionsPanel.vue';
import { CustomAttributeValidationService } from '../services/CustomAttributeValidationService';
import { CustomOptionValidateService } from '../services/CustomOptionValidateService';
import { LanguageValidateService } from '../services/LanguageValidateService';

@Component({
  components: {
    CustomOptionsPanel,
    ValidationInput,
  },
})
export default class CustomAttributePanel extends Vue {
  i18n = useI18n();

  attrTypesStore = AttributeTypesStore();

  displayTypesStore = DisplayTypesStore();

  availableLocales = AvailableLocales;

  customAttributeValidationService = CustomAttributeValidationService;

  customOptionValidationService = CustomOptionValidateService;

  langValidateService = LanguageValidateService;

  @Model
  // eslint-disable-next-line indent
  inputAttr!: CustomAttribute;

  @Prop
  // eslint-disable-next-line indent
  readonly = true;

  infoExpanded = true;

  langExpanded = false;

  attrTypeOption = {} as AttributeTypeOption;

  displayTypeOption = {} as DisplayTypeOption;

  created(): void {
    this.initialize();
  }

  @Watch('inputAttr.id')
  onModelValueUpdated(newValue: number, oldValue: number) {
    this.initialize();
  }

  initialize(): void {
    const attrType = this.attrTypesStore.getOption(this.inputAttr.attributeType);
    this.attrTypeOption = attrType;
    const displayType = this.displayTypesStore.getOption(this.inputAttr.displayType);
    this.displayTypeOption = displayType;
  }

  onAttrTypeUpdated(attrOption: AttributeTypeOption) {
    this.inputAttr.attributeType = attrOption.value;
  }

  onDisplayTypeUpdated(diaplayOption: DisplayTypeOption) {
    this.inputAttr.displayType = diaplayOption.value;
  }
}
</script>

<style lang="sass" scoped>
.expandable
  font-family: 'Noto Sans TC'
</style>
