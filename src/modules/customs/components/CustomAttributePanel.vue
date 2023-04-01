<template>
  <div>
    <!-- action bar -->
    <div class="row shadow-1 q-mb-sm q-pa-sm"
      style="border-radius: 10px"
    >
      <q-btn v-if="readonly" dense round flat color="grey" icon="edit"
        @click="readonly = !readonly"
      />
      <div v-else class="row">
        <q-btn dense round flat color="red" icon="close"
          class="bg-grey-4 q-mr-sm"
          @click="readonly = !readonly"
        />
        <q-btn dense round flat color="green" icon="done"
          class="bg-grey-4"
          @click="onConfirmClicked"
        />
      </div>
      <q-space/>
      <div class="q-ma-sm">
        Last edited: {{ new Date(defaultAttr.updateDate).getDateStr() }}
        <q-tooltip>
          <div>{{ new Date(defaultAttr.updateDate).toString() }}</div>
          <div>By {{ defaultAttr.updateUser }}</div>
        </q-tooltip>
      </div>
    </div>

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
        <q-input v-model="defaultAttr.number" dense filled :readonly="readonly"></q-input>
        <!-- name -->
        <div class="q-ma-sm">{{ $t('customs.generic.name') }}</div>
        <q-input v-model="defaultAttr.name" dense filled :readonly="readonly"></q-input>
        <!-- disable -->
        <div class="row">
          <q-checkbox
            left-label
            class="q-ma-sm"
            v-model="defaultAttr.isDisabled"
            :disable="readonly"
            :label="$t('customs.generic.disable')"
          />
        </div>
        <!-- attribute type -->
        <div class="q-ma-sm">{{ $t('customs.attributes.attribteType') }}</div>
        <q-select filled v-model="attrTypeOption" :options="attrTypesStore.i18nOptions"
          :readonly="readonly"
          @update:modelValue="onAttrTypeUpdated" />
        <!-- display type -->
        <div class="q-ma-sm">{{ $t('customs.attributes.displayType') }}</div>
        <q-select filled v-model="displayTypeOption" :options="displayTypesStore.i18nOptions"
          :readonly="readonly"
          @update:modelValue="onDisplayTypeUpdated" />
        <!-- remarks -->
        <div class="q-ma-sm">{{ $t('remarks') }}</div>
        <q-input
          v-model="defaultAttr.remarks"
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
          <q-input v-model="defaultAttr.languages[locale]"
            dense filled :readonly="readonly"></q-input>
        </div>
      </div>
    </q-expansion-item>
  </div>
</template>

<script lang="ts">
import {
  Component, Model, Vue, Watch,
} from 'vue-facing-decorator';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import 'src/extensions/date.extensions';
import { AvailableLocales } from 'src/models/Locale';
import { CustomAttributeService } from '../services/CustomAttributeService';
import { AttributeTypeOption, CustomAttribute, DisplayTypeOption } from '../models/CustomAttribute';
import AttributeTypesStore from '../stores/AttributeTypesStore';
import DisplayTypesStore from '../stores/DisplayTypesStore';

@Component({})
export default class CustomAttributePanel extends Vue {
  i18n = useI18n();

  attrTypesStore = AttributeTypesStore();

  displayTypesStore = DisplayTypesStore();

  $q = useQuasar();

  customAttrService = CustomAttributeService;

  availableLocales = AvailableLocales;

  @Model
  // eslint-disable-next-line indent
  inputAttr!: CustomAttribute;

  defaultAttr = {} as CustomAttribute;

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
    this.readonly = true;
    this.defaultAttr = JSON.parse(JSON.stringify(this.inputAttr));
    const attrType = this.attrTypesStore.getOption(this.defaultAttr.attributeType);
    this.attrTypeOption = attrType;
    const displayType = this.displayTypesStore.getOption(this.defaultAttr.displayType);
    this.displayTypeOption = displayType;
  }

  async onConfirmClicked(): Promise<void> {
    const code = await this.customAttrService.update(this.defaultAttr.id, {
      number: this.defaultAttr.number,
      name: this.defaultAttr.name,
      attributeType: this.defaultAttr.attributeType,
      displayType: this.defaultAttr.displayType,
      isDisabled: this.defaultAttr.isDisabled,
      languages: this.defaultAttr.languages,
      remarks: this.defaultAttr.remarks,
    });

    if (code === 0) {
      this.inputAttr.number = this.defaultAttr.number;
      this.inputAttr.name = this.defaultAttr.name;
      this.inputAttr.remarks = this.defaultAttr.remarks;
      this.inputAttr.languages = this.defaultAttr.languages;
      this.inputAttr.isDisabled = this.defaultAttr.isDisabled;
      this.inputAttr.createUser = this.defaultAttr.createUser;
      this.inputAttr.updateUser = this.defaultAttr.updateUser;
      this.inputAttr.createDate = this.defaultAttr.createDate;
      this.inputAttr.updateDate = this.defaultAttr.updateDate;
      this.readonly = true;
      this.$q.notify({
        message: `${this.inputAttr.number}: ${this.i18n.t('actions.update.success')}`,
        color: 'secondary',
      });
    }
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
