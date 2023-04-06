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
          @click="onCancelClicked"
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
    <CustomAttributePanel
      v-model="defaultAttr"
      :readonly="readonly"
    />
  </div>
</template>

<script lang="ts">
import {
  Component, Model, Vue, Watch,
} from 'vue-facing-decorator';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import 'src/extensions/date.extensions';
import { CustomAttributeService } from '../services/CustomAttributeService';
import { CustomAttribute } from '../models/CustomAttribute';
import CustomAttributePanel from './CustomAttributePanel.vue';
import { CustomAttributeValidationService } from '../services/CustomAttributeValidationService';

@Component({
  components: {
    CustomAttributePanel,
  },
})
export default class CustomAttributeEditPanel extends Vue {
  i18n = useI18n();

  $q = useQuasar();

  customAttrService = CustomAttributeService;

  customAttrValidationRuleService = CustomAttributeValidationService;

  @Model
  // eslint-disable-next-line indent
  inputAttr!: CustomAttribute;

  defaultAttr = {} as CustomAttribute;

  readonly = true;

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
  }

  async onConfirmClicked(): Promise<void> {
    const result = this.customAttrValidationRuleService.checkAttributeRules(this.defaultAttr);
    if (result) {
      this.$q.notify({
        message: `Error: ${this.i18n.t(result)}`,
        color: 'red',
      });
      return;
    }
    const code = await this.customAttrService.update(this.defaultAttr.id, {
      number: this.defaultAttr.number,
      name: this.defaultAttr.name,
      attributeType: this.defaultAttr.attributeType,
      displayType: this.defaultAttr.displayType,
      isDisabled: this.defaultAttr.isDisabled,
      languages: this.defaultAttr.languages,
      options: this.defaultAttr.options,
      remarks: this.defaultAttr.remarks,
    });

    if (code === 0) {
      this.inputAttr.number = this.defaultAttr.number;
      this.inputAttr.name = this.defaultAttr.name;
      this.inputAttr.remarks = this.defaultAttr.remarks;
      this.inputAttr.languages = this.defaultAttr.languages;
      this.inputAttr.options = this.defaultAttr.options;
      this.inputAttr.isDisabled = this.defaultAttr.isDisabled;
      this.inputAttr.createUser = this.defaultAttr.createUser;
      this.inputAttr.updateUser = this.defaultAttr.updateUser;
      this.inputAttr.createDate = this.defaultAttr.createDate;
      this.inputAttr.updateDate = this.defaultAttr.updateDate;
      this.readonly = true;
      this.$q.notify({
        message: `${this.inputAttr.number}: ${this.i18n.t('actions.updates.success')}`,
        color: 'secondary',
      });
    }
  }

  onCancelClicked(): void {
    this.initialize();
  }
}
</script>

<style lang="sass" scoped>
.expandable
  font-family: 'Noto Sans TC'
</style>
