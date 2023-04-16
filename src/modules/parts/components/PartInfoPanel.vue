<template>
  <div>
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
            <ValidationInput v-model="partVersion.master.number"
              :inputValidator="partValidationService.checkNumberRules"
              :readonly="true"
            />
            <div class="q-ma-sm">{{ $t('parts.name') }}</div>
            <ValidationInput v-model="partVersion.master.name"
              :inputValidator="partValidationService.checkNameRules"
              :readonly="true"
            />
            <div>
              <div class="q-ma-sm">{{ $t('parts.view') }}</div>
              <q-select
                filled
                dense
                v-model="viewTypeOption"
                :options="viewTypeOptionsStore.i18nOptions"
                :readonly="true"
              />
            </div>
            <div class="column">
              <div class="q-ma-sm">{{ $t('remarks') }}</div>
              <q-input
                v-model="partVersion.remarks"
                filled
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
                  v-model="partVersion.customValues[attribute.number]"
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
import {
  Component, Model, Prop, Vue,
} from 'vue-facing-decorator';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import 'src/extensions/date.extensions';
import ValidationInput from 'src/components/ValidationInput.vue';
import { SelectOption } from 'src/models/SelectOption';
import { AttributeLinksStore } from 'src/modules/customs/stores/AttributeLinksStore';
import { CustomOption, DisplayType } from 'src/modules/customs/models/CustomAttribute';
import { ViewTypeOptionsStore } from '../stores/ViewTypeOptionsStore';
import PartValidationService from '../services/PartValidateService';
import { ViewTypeOption } from '../models/Part';
import { PartMaster, PartVersion } from '../models/PartVersion';

@Component({
  components: {
    ValidationInput,
  },
})
export default class PartInfoPanel extends Vue {
  @Prop id = '';

  @Prop readonly = true;

  @Model partVersion: PartVersion = {
    id: 0,
    version: 0,
    checkout: false,
    master: {} as PartMaster,
    customValues: {} as Record<string, string>,
    createUser: '',
    createDate: new Date(),
    updateUser: '',
    updateDate: new Date(),
    remarks: '',
  };

  i18n = useI18n();

  $q = useQuasar();

  attrLinksStore = AttributeLinksStore();

  viewTypeOptionsStore = ViewTypeOptionsStore();

  partValidationService = PartValidationService;

  infoExpanded = true;

  customValuesExpanded = true;

  viewTypeOption = {} as ViewTypeOption;

  readonly SingleSelect = DisplayType.SingleSelect;

  middleCustomOptions: Record<number, string> = {};

  created() {
    this.$q.loading.show({
      delay: 300,
    });
    this.viewTypeInit();
    for (let i = 0; i < this.attrLinksStore.content.attributes.length; i += 1) {
      const attr = this.attrLinksStore.content.attributes[i];
      if (attr.displayType === DisplayType.SingleSelect) {
        const firstOption = attr.options[0];
        this.middleCustomOptions[attr.id] = firstOption.key;
      }
    }
    this.$q.loading.hide();
  }

  async viewTypeInit(): Promise<void> {
    const targetViewType = this.viewTypeOptionsStore.i18nOptions.find(
      (viewType) => viewType.value === this.partVersion.master.viewType,
    );
    if (targetViewType) {
      this.viewTypeOption = targetViewType;
    } else {
      const option = this.viewTypeOptionsStore.i18nOptions[0];
      this.viewTypeOption = option;
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
    this.partVersion.customValues[selectOption.attributeNumber] = selectOption.value;
  }
}
</script>

<style lang="sass" scoped>
.outer-max
  height: calc(100vh - 70px)
</style>
